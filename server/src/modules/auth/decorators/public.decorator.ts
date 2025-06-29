import { SetMetadata } from '@nestjs/common';

/**
 * Public Decorator
 *
 * Decorator để đánh dấu các route công khai, không cần xác thực
 * Sử dụng SetMetadata để gắn metadata 'isPublic' vào route handler
 */
export const IS_PUBLIC_KEY = 'isPublic';
export const Public = (isActive?: boolean) => {
    if (isActive === undefined || isActive === null) {
        isActive = true; // Mặc định là true nếu không truyền giá trị
        return SetMetadata(IS_PUBLIC_KEY, isActive);
    }
    const value = isActive === true ? true : false;
    return SetMetadata(IS_PUBLIC_KEY, value);
};