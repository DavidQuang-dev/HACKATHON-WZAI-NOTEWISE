import {
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    Column,
    BaseEntity,
    BeforeInsert,
    BeforeUpdate,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

export abstract class AbstractEntity extends BaseEntity {
    @ApiProperty({
        description: 'Thời gian tạo bản ghi',
        example: '2024-01-01T00:00:00.000Z',
    })
    @CreateDateColumn({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP(6)',
        comment: 'Thời gian tạo bản ghi',
    })
    created_at: Date;

    @ApiProperty({
        description: 'ID người tạo bản ghi',
        example: 'uuid-string',
        nullable: true,
    })
    @Column({
        type: 'uuid',
        nullable: true,
        comment: 'ID người dùng tạo bản ghi',
    })
    created_by: string;

    @ApiProperty({
        description: 'Thời gian cập nhật bản ghi lần cuối',
        example: '2024-01-01T00:00:00.000Z',
    })
    @UpdateDateColumn({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP(6)',
        onUpdate: 'CURRENT_TIMESTAMP(6)',
        comment: 'Thời gian cập nhật bản ghi lần cuối',
    })
    updated_at: Date;

    @ApiProperty({
        description: 'ID người cập nhật bản ghi lần cuối',
        example: 'uuid-string',
        nullable: true,
    })
    @Column({
        type: 'uuid',
        nullable: true,
        comment: 'ID người dùng cập nhật bản ghi lần cuối',
    })
    updated_by: string;

    @ApiProperty({
        description: 'Thời gian xóa bản ghi (soft delete)',
        example: '2024-01-01T00:00:00.000Z',
        nullable: true,
    })
    @DeleteDateColumn({
        type: 'timestamp',
        nullable: true,
        comment: 'Thời gian xóa bản ghi (soft delete)',
    })
    @Exclude()
    deleted_at: Date;
    // Hooks để tự động cập nhật audit fields
    @BeforeInsert()
    setCreatedByFromContext() {
        const userContext = this.getCurrentUserContext();

        if (userContext?.id) {
            this.created_by = userContext.id;
            this.updated_by = userContext.id;
        }
    }

    @BeforeUpdate()
    setUpdatedByFromContext() {
        const userContext = this.getCurrentUserContext();

        if (userContext?.id) {
            this.updated_by = userContext.id;
        }
    }
    /**
     * Get current user context từ AsyncLocalStorage
     * Sẽ được set bởi AuditInterceptor
     */
    private getCurrentUserContext(): {
        id: string;
        email: string;
        role: string;
    } | null {
        try {
            const storage = global.__userContextStorage__;

            if (!storage) {
                console.warn('getCurrentUserContext - Global storage not initialized');
                return null;
            }

            if (typeof storage.getStore !== 'function') {
                console.warn(
                    'getCurrentUserContext - Storage.getStore is not a function',
                );
                return null;
            }

            const context = storage.getStore();

            return context || null;
        } catch (error) {
            console.error('getCurrentUserContext - Error:', error);
            return null;
        }
    }

    /**
     * Manually set audit fields - for special cases
     */
    setAuditFields(id: string, isUpdate = false) {
        if (isUpdate) {
            this.updated_by = id;
        } else {
            this.created_by = id;
            this.updated_by = id;
        }
    }
}