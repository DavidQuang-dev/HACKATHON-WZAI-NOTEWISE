import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    Query,
    HttpCode,
    HttpStatus,
    ParseUUIDPipe,
    UseInterceptors,
    Type,
} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiParam,
    ApiQuery,
    ApiBody,
} from '@nestjs/swagger';
import { BaseService } from './base.service';
import { BaseFilterDto } from './dto/base-filter.dto';
import { PaginatedResponseDto } from './dto/paginated-response.dto';
import { DeepPartial } from 'typeorm';
import { Public } from 'src/modules/auth/decorators/public.decorator';
import { AbstractEntity } from './entities/base.entity';

type RouteOptions = {
    isPublic?: boolean;
    summary?: string;
    description?: string;
    disabled?: boolean;
};

export interface BaseControllerOptions<
    TEntity extends AbstractEntity = AbstractEntity,
    TCreateDto = any,
    TUpdateDto = any,
    TFilterDto extends BaseFilterDto = BaseFilterDto
> {
    apiTags?: string;
    entity?: string;
    dto?: {
        create?: Type<TCreateDto>;
        update?: Type<TUpdateDto>;
        filter?: Type<TFilterDto>;
    };
    routes?: {
        findAll?: RouteOptions;
        findOne?: RouteOptions;
        create?: RouteOptions;
        update?: RouteOptions;
        delete?: RouteOptions;
        restore?: RouteOptions;
    };
    relations?: string[];
    select?: string[];
}

export function BaseController<
    TEntity extends AbstractEntity,
    TCreateDto = any,
    TUpdateDto = any,
    TFilterDto extends BaseFilterDto = BaseFilterDto
>(
    options: BaseControllerOptions<TEntity, TCreateDto, TUpdateDto, TFilterDto> = {},
) {
    @ApiTags(options.apiTags || 'Base CRUD')
    @ApiBearerAuth()
    @Controller()
    abstract class BaseControllerClass {
        constructor(public readonly service: BaseService<TEntity>) { }

        @Public(options.routes?.findAll?.isPublic)
        @Get()
        @ApiQuery({
            name: '',
            required: false,
            type: options.dto?.filter || BaseFilterDto,
            style: 'form',
            explode: true,
            description: 'Filtering options',
        })
        @HttpCode(HttpStatus.OK)
        @ApiOperation({
            summary: options.routes?.findAll?.summary || `Get all ${options.entity || 'entities'}`,
            description: options.routes?.findAll?.description || `Retrieve a paginated list of ${options.entity || 'entities'}. Required JWT: ${options.routes?.findAll?.isPublic == true ? 'false' : 'true'}.`,
        })
        @ApiResponse({
            status: HttpStatus.OK,
            description: 'List of entities retrieved successfully',
            type: PaginatedResponseDto,
        })
        async findAll(
            @Query() filterDto?: TFilterDto,
        ): Promise<PaginatedResponseDto<TEntity>> {
            const filter = filterDto || (new BaseFilterDto() as TFilterDto);
            return await this.service.findAll(filter, options.relations || [], options.select || []);
        }

        @Public(options.routes?.findOne?.isPublic)
        @Get(':id')
        @HttpCode(HttpStatus.OK)
        @ApiOperation({
            summary: options.routes?.findOne?.summary || `Get ${options.entity || 'entity'} by ID`,
            description: options.routes?.findOne?.description || `Retrieve a single ${options.entity || 'entity'} by its ID. Required JWT: ${options.routes?.findOne?.isPublic == true ? 'false' : 'true'}.`,
        })
        @ApiParam({
            name: 'id',
            description: `${options.entity || 'Entity'} ID`,
            type: 'string',
            format: 'uuid'
        })
        @ApiResponse({
            status: HttpStatus.OK,
            description: 'Entity retrieved successfully',
        })
        @ApiResponse({
            status: HttpStatus.NOT_FOUND,
            description: 'Entity not found',
        })
        async findOne(
            @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
        ): Promise<TEntity> {
            return await this.service.findOne(id, [...options.relations || []]);
        }

        @Public(options.routes?.create?.isPublic)
        @Post()
        @HttpCode(HttpStatus.CREATED)
        @ApiOperation({
            summary: options.routes?.create?.summary || `Create new ${options.entity || 'entity'}`,
            description: options.routes?.create?.description || `Create a new ${options.entity || 'entity'}. Required JWT: ${options.routes?.create?.isPublic == true ? 'false' : 'true'}.`
        })
        @ApiBody({
            type: options.dto?.create,
            required: true,
        })
        @ApiResponse({
            status: HttpStatus.CREATED,
            description: 'Entity created successfully',
        })
        @ApiResponse({
            status: HttpStatus.BAD_REQUEST,
            description: 'Invalid input data',
        })
        @ApiResponse({
            status: HttpStatus.CONFLICT,
            description: 'Entity already exists',
        })
        async create(@Body() createDto: TCreateDto): Promise<TEntity> {
            return await this.service.create(createDto as DeepPartial<TEntity>, options.relations || []);
        }

        @Public(options.routes?.update?.isPublic)
        @Put(':id')
        @HttpCode(HttpStatus.OK)
        @ApiOperation({
            summary: options.routes?.update?.summary || `Update ${options.entity || 'entity'} by ID`,
            description: options.routes?.update?.description || `Update an existing ${options.entity || 'entity'}. Required JWT: ${options.routes?.update?.isPublic == true ? 'false' : 'true'}.`
        })
        @ApiParam({
            name: 'id',
            description: `${options.entity || 'Entity'} ID`,
            type: 'string',
            format: 'uuid'
        })
        @ApiBody({
            type: options.dto?.update,
            required: true,
        })
        @ApiResponse({
            status: HttpStatus.OK,
            description: 'Entity updated successfully',
        })
        @ApiResponse({
            status: HttpStatus.NOT_FOUND,
            description: 'Entity not found',
        })
        @ApiResponse({
            status: HttpStatus.BAD_REQUEST,
            description: 'Invalid input data',
        })
        async update(
            @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
            @Body() updateDto: TUpdateDto,
        ): Promise<TEntity> {
            return await this.service.update(id, updateDto);
        }

        @Public(options.routes?.delete?.isPublic)
        @Delete(':id')
        @HttpCode(HttpStatus.OK)
        @ApiOperation({
            summary: options.routes?.delete?.summary || `Delete ${options.entity || 'entity'} by ID`,
            description: options.routes?.delete?.description || `Soft delete a ${options.entity || 'entity'} by ID. Required JWT: ${options.routes?.delete?.isPublic == true ? 'false' : 'true'}.`
        })
        @ApiParam({
            name: 'id',
            description: `${options.entity || 'Entity'} ID`,
            type: 'string',
            format: 'uuid'
        })
        @ApiResponse({
            status: HttpStatus.OK,
            description: 'Entity deleted successfully',
            schema: {
                type: 'object',
                properties: {
                    deleted: { type: 'boolean' },
                    message: { type: 'string' },
                },
            },
        })
        @ApiResponse({
            status: HttpStatus.NOT_FOUND,
            description: 'Entity not found',
        })
        async remove(
            @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
        ): Promise<{ deleted: boolean; message: string }> {
            return await this.service.remove(id);
        }

        @Public(options.routes?.restore?.isPublic)
        @Post(':id/restore')
        @HttpCode(HttpStatus.OK)
        @ApiOperation({
            summary: options.routes?.restore?.summary || `Restore deleted ${options.entity || 'entity'} by ID`,
            description: options.routes?.restore?.description || `Restore a soft-deleted ${options.entity || 'entity'} by ID. Required JWT: ${options.routes?.restore?.isPublic == true ? 'false' : 'true'}.`
        })
        @ApiParam({
            name: 'id',
            description: `${options.entity || 'Entity'} ID`,
            type: 'string',
            format: 'uuid'
        })
        @ApiResponse({
            status: HttpStatus.OK,
            description: 'Entity restored successfully',
        })
        @ApiResponse({
            status: HttpStatus.NOT_FOUND,
            description: 'Deleted entity not found',
        })
        async restore(
            @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
        ): Promise<TEntity> {
            return await this.service.restore(id);
        }
    }

    return BaseControllerClass;
}
