import {
    BadRequestException,
    Injectable,
    Logger,
    NotFoundException,
} from '@nestjs/common';
import {
    Repository,
    FindManyOptions,
    FindOneOptions,
    ILike,
    Not,
    DeepPartial,
    SelectQueryBuilder,
} from 'typeorm';
import { BaseFilterDto } from './dto/base-filter.dto';
import { PaginatedResponseDto } from './dto/paginated-response.dto';
import { AbstractEntity } from './entities/base.entity';
@Injectable()
export abstract class BaseService<T extends AbstractEntity> {
    protected readonly logger: Logger;
    constructor(
        protected readonly repository: Repository<T>,
        protected readonly relationServices?: Record<
            string,
            { findOne(id: string, relations: string[]): Promise<any> }
        >,
    ) {
        this.logger = new Logger(this.constructor.name);
    }

    /**
     * Create new entity
     * @param createDto - The data to create the entity
     * @returns The created entity
     */
    async create(createDto: DeepPartial<T>, relations: string[]): Promise<T> {
        try {
            this.logger.log(`Creating new ${this.getEntityName()}`);
            const findBy = this.getDuplicateFields();

            for (const field of findBy) {
                const value = createDto[field];
                if (!value) continue;

                const existing = await this.findOneByOptions({
                    where: { [field]: value } as any,
                });
                if (existing) {
                    throw new BadRequestException(
                        `${this.getEntityName()} with ${field} ${value} already exists`,
                    );
                }
            }

            // Verify existence of relations
            await this.verifyRelationsExist(createDto, relations);

            this.logger.log(`Creating ${this.getEntityName()} with data:`, createDto);

            const entity = this.repository.create(createDto);

            // Set relations if provided
            for (const relation of relations) {
                const id = createDto[`${relation}Id`];
                if (id) {
                    entity[relation] = { id };
                }
            }

            this.logger.log(`Entity: `, entity);
            const result = await this.repository.save(entity);

            this.logger.log(
                `Created successfully ${this.getEntityName()} with entities:`,
                result,
            );

            return result as T;
        } catch (error) {
            this.logger.error(`Error creating ${this.getEntityName()}:`, error);
            throw error;
        }
    } /**
   * Find all entities with filtering and pagination
   * @param filterDto - The filter options
   * @returns The paginated response
   */
    async findAll(
        filterDto: BaseFilterDto,
        relations: string[],
        select: string[],
    ): Promise<PaginatedResponseDto<T>> {
        try {
            const page = filterDto.page || 1;
            const limit = filterDto.limit || 10;
            const sortBy = filterDto.sortBy || 'created_at';
            const sortOrder = filterDto.sortOrder || 'DESC';
            const search = filterDto.search;

            // Calculate skip value for pagination
            const skip = (page - 1) * limit;

            // Create query builder with base filters
            const entityName = this.getEntityName();
            const entityAlias = entityName.toLowerCase();
            const queryBuilder = this.createQueryBuilder(filterDto);

            // Add search condition
            if (search && this.getSearchableFields().length > 0) {
                const searchFields = this.getSearchableFields();

                // Dùng similarity để so sánh mờ (fuzzy match)
                const fuzzyConditions = searchFields
                    .map(
                        (field) =>
                            `similarity(unaccent(${entityAlias}."${field}"), unaccent(:search)) > 0.2`,
                    )
                    .join(' OR ');

                // Ngoài ra, hỗ trợ ILIKE + %term% để bắt chuỗi gần chính xác
                const ilikeConditions = searchFields
                    .map(
                        (field) =>
                            `unaccent(${entityAlias}."${field}") ILIKE unaccent(:ilikeSearch)`,
                    )
                    .join(' OR ');

                // Kết hợp cả hai
                queryBuilder.andWhere(`(${fuzzyConditions} OR ${ilikeConditions})`, {
                    search,
                    ilikeSearch: `%${search}%`,
                });
            }

            // Add valid relations
            if (relations && relations.length > 0) {
                this.autoJoinRelations(queryBuilder, entityAlias, relations);
            }

            // Add sorting and pagination
            queryBuilder
                .orderBy(`${entityAlias}.${sortBy}`, sortOrder as 'ASC' | 'DESC')
                .skip(skip)
                .take(limit);

            // Add select
            if (select && select.length > 0) {
                const auditFields = [
                    'created_at',
                    'updated_at',
                    'created_by',
                    'updated_by',
                    'deleted_at',
                ];
                const finalSelect = [...select];
                auditFields.forEach((field) => {
                    if (!finalSelect.includes(field)) {
                        finalSelect.push(field);
                    }
                });

                queryBuilder.select(
                    finalSelect.map((field) => `${entityAlias}.${field}`),
                );
            }

            this.logger.log(
                `Finding all ${entityName} with query:`,
                queryBuilder.getQuery(),
            );

            // Get data and total count
            const [data, totalItems] = await queryBuilder.getManyAndCount();

            return new PaginatedResponseDto(data, totalItems, page, limit);
        } catch (error) {
            this.logger.error(`Error finding all ${this.getEntityName()}:`, error);
            throw error;
        }
    }

    /**
     * Find one entity by ID
     * @param id - The ID of the entity
     * @returns The found entity
     */
    async findOne(id: string, relations: string[]): Promise<T> {
        try {
            this.logger.log(`Finding ${this.getEntityName()} by ID: ${id}`);
            const whereCondition: any = { [this.getPrimaryColumnName()]: id };

            const entity = await this.repository.findOne({
                where: whereCondition,
                relations,
            });

            relations.forEach((relation) => {
                if (
                    entity &&
                    entity[relation] &&
                    typeof entity[relation] === 'object'
                ) {
                    const fieldsToRemove = [
                        'created_at',
                        'updated_at',
                        'created_by',
                        'updated_by',
                        'deleted_at',
                    ];
                    fieldsToRemove.forEach((field) => {
                        delete entity[relation][field];
                    });
                }
            });

            if (!entity) {
                throw new NotFoundException(
                    `${this.getEntityName()} with ID ${id} not found`,
                );
            }

            return entity;
        } catch (error) {
            this.logger.error(`Error finding ${this.getEntityName()} by ID:`, error);
            throw error;
        }
    }

    /**
     * Update entity by ID
     * @param id - The ID of the entity
     * @param updateDto - The data to update the entity
     * @returns The updated entity
     */
    async update(id: string, updateDto: any): Promise<T> {
        try {
            this.logger.log(`Updating ${this.getEntityName()} with ID: ${id}`);

            // Check if entity exists
            const existingEntity = await this.findOne(id, []);

            if (!existingEntity) {
                throw new NotFoundException(
                    `${this.getEntityName()} with ID ${id} not found`,
                );
            } // Update entity
            await this.repository.update(id, updateDto);
            const updatedEntity = await this.findOne(id, []);

            this.logger.log(`Updated ${this.getEntityName()} with ID: ${id}`);
            return updatedEntity;
        } catch (error) {
            this.logger.error(`Error updating ${this.getEntityName()}:`, error);
            throw error;
        }
    }

    /**
     * Soft delete entity by ID
     * @param id - The ID of the entity
     * @returns The deleted entity
     */
    async remove(id: string): Promise<{ deleted: boolean; message: string }> {
        try {
            this.logger.log(`Soft deleting ${this.getEntityName()} with ID: ${id}`);

            // Check if entity exists
            const existingEntity = await this.repository.findOne({
                where: { [this.getPrimaryColumnName()]: id } as any,
            });

            if (!existingEntity) {
                throw new NotFoundException(
                    `${this.getEntityName()} with ID ${id} not found`,
                );
            } 
            
            // Soft delete
            await this.repository.softDelete(id);

            this.logger.log(`Soft deleted ${this.getEntityName()} with ID: ${id}`);
            return {
                deleted: true,
                message: `${this.getEntityName()} with ID ${id} has been deleted`,
            };
        } catch (error) {
            this.logger.error(`Error deleting ${this.getEntityName()}:`, error);
            throw error;
        }
    }

    /**
     * Restore soft deleted entity by ID
     * @param id - The ID of the entity
     * @returns The restored entity
     */
    async restore(id: string): Promise<T> {
        try {
            this.logger.log(`Restoring ${this.getEntityName()} with ID: ${id}`);

            // Check if entity exists in soft deleted state
            const existingEntity = await this.repository.findOne({
                where: { [this.getPrimaryColumnName()]: id } as any,
                withDeleted: true,
            });

            if (!existingEntity) {
                throw new NotFoundException(
                    `Deleted ${this.getEntityName()} with ID ${id} not found`,
                );
            }

            // Restore entity
            await this.repository.restore(id);
            const restoredEntity = await this.findOne(id, []);

            this.logger.log(`Restored ${this.getEntityName()} with ID: ${id}`);
            return restoredEntity;
        } catch (error) {
            this.logger.error(`Error restoring ${this.getEntityName()}:`, error);
            throw error;
        }
    }

    /**
     * Find multiple entities with custom options
     * @param options - The options to find the entities
     * @returns The found entities
     */
    async findMany(options?: FindManyOptions<T>): Promise<T[]> {
        try {
            return await this.repository.find(options);
        } catch (error) {
            this.logger.error(
                `Error finding multiple ${this.getEntityName()}:`,
                error,
            );
            throw error;
        }
    }

    /**
     * Find one entity with custom options
     * @param options - The options to find the entity
     * @returns The found entity
     */
    async findOneByOptions(options: FindOneOptions<T>): Promise<T | null> {
        try {
            return await this.repository.findOne(options);
        } catch (error) {
            this.logger.error(`Error finding ${this.getEntityName()}:`, error);
            throw error;
        }
    }

    /**
     * Count entities with options
     * @param options - The options to count the entities
     * @returns The number of entities
     */
    async count(options?: FindManyOptions<T>): Promise<number> {
        try {
            return await this.repository.count(options);
        } catch (error) {
            this.logger.error(`Error counting ${this.getEntityName()}:`, error);
            throw error;
        }
    }

    /**
     * Check if entity exists by ID
     * @param id - The ID of the entity
     * @returns Whether the entity exists
     */
    async exists(id: string): Promise<boolean> {
        try {
            const count = await this.repository.count({ where: { id } as any });
            return count > 0;
        } catch (error) {
            this.logger.error(
                `Error checking existence of ${this.getEntityName()}:`,
                error,
            );
            throw error;
        }
    }

    async autoJoinRelations(
        queryBuilder,
        baseAlias: string,
        relations: string[],
    ) {
        const joined = new Set<string>();

        relations.forEach((relationPath) => {
            const parts = relationPath.split('.');
            let currentAlias = baseAlias;

            for (const part of parts) {
                const nextAlias = `${currentAlias}_${part}`;
                const fullPath = `${currentAlias}.${part}`;

                if (!joined.has(fullPath)) {
                    queryBuilder.leftJoinAndSelect(fullPath, nextAlias);
                    joined.add(fullPath);
                }

                currentAlias = nextAlias;
            }
        });
    }

    /**
     * Get repository for advanced operations
     * @returns The repository
     */
    getRepository(): Repository<T> {
        return this.repository;
    }

    /**
     * Get primary column name for the entity
     * @returns The primary column name
     */
    protected getPrimaryColumnName(): string {
        const metadata = this.repository.metadata;
        return metadata.primaryColumns[0]?.propertyName || 'id';
    }

    /**
     * Override this method in child classes to specify searchable fields
     * @returns The searchable fields
     */
    protected getSearchableFields(): string[] {
        return [];
    }

    /**
     * Get fields to check for duplicates
     * @returns The fields to check for duplicates
     */
    protected getDuplicateFields(): string[] {
        return [];
    }

    /**
     * Get entity name for logging
     * @returns The entity name
     */
    protected getEntityName(): string {
        return this.repository.metadata.name;
    }
    /**
     * Override method fields to filter in findAll
     * @returns The fields to filter in findAll
     */
    protected createQueryBuilder(filter: any): SelectQueryBuilder<T> {
        const entityAlias = this.getEntityName().toLowerCase();
        const queryBuilder = this.repository.createQueryBuilder(entityAlias);
        return queryBuilder;
    }

    /**
     * Verify that all relations exist in the DTO
     * @param dto - The data transfer object containing relation IDs
     * @param relations - The list of relation names to verify
     * @throws BadRequestException if any relation does not exist
     */
    protected async verifyRelationsExist(
        dto: any,
        relations: string[],
    ): Promise<void> {
        for (const relation of relations) {
            this.logger.log(`Verifying relation "${relation}" exists in DTO`);
            const idField = `${relation}Id`; // e.g. campusId, documentId
            const service = this.relationServices?.[relation]; // e.g. { campus: CampusesService, document: DocumentService }

            if (!service) {
                // No service provided for this relation
                this.logger.warn(`No service provided for relation "${relation}"`);
                continue;
            }

            const id = dto[idField]; // e.g. dto.campusId, dto.documentId | Get value from DTO
            if (!id) {
                this.logger.warn(`DTO is missing relation ID: ${idField}`);
                continue;
            }

            try {
                await service.findOne(id, []); // throws NotFoundException if not exists
            } catch (error) {
                this.logger.error(`Relation ${relation} with ID ${id} not found`);
                throw new BadRequestException(
                    `Relation ${relation} with ID ${id} does not exist`,
                );
            }
        }
    }
}