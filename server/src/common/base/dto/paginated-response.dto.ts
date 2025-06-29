import { ApiProperty } from '@nestjs/swagger';

export class PaginationMeta {
    @ApiProperty({
        description: 'Tổng số bản ghi',
        example: 100,
    })
    totalItems: number;

    @ApiProperty({
        description: 'Số lượng bản ghi trong trang hiện tại',
        example: 10,
    })
    itemCount: number;

    @ApiProperty({
        description: 'Số lượng bản ghi trên mỗi trang',
        example: 10,
    })
    itemsPerPage: number;

    @ApiProperty({
        description: 'Tổng số trang',
        example: 10,
    })
    totalPages: number;

    @ApiProperty({
        description: 'Trang hiện tại',
        example: 1,
    })
    currentPage: number;

    @ApiProperty({
        description: 'Có trang trước không',
        example: false,
    })
    hasPreviousPage: boolean;

    @ApiProperty({
        description: 'Có trang tiếp theo không',
        example: true,
    })
    hasNextPage: boolean;
}

export class PaginatedResponseDto<T> {
    @ApiProperty({
        description: 'Danh sách dữ liệu',
        isArray: true,
    })
    pagination: T[];

    @ApiProperty({
        description: 'Thông tin phân trang',
        type: PaginationMeta,
    })
    meta: PaginationMeta;

    constructor(pagination: T[], totalItems: number, page: number | string, limit: number | string) {
        this.pagination = pagination;

        const pageNum = typeof page === 'string' ? parseInt(page, 10) : page;
        const limitNum = typeof limit === 'string' ? parseInt(limit, 10) : limit;
        const totalPages = Math.ceil(totalItems / limitNum);

        this.meta = {
            totalItems,
            itemCount: pagination.length,
            itemsPerPage: limitNum,
            totalPages,
            currentPage: pageNum,
            hasPreviousPage: pageNum > 1,
            hasNextPage: pageNum < totalPages,
        };
    }
} 