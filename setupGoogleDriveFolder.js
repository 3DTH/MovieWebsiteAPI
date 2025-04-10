const googleDriveService = require('./services/googleDriveServiceveService');

// Hàm khởi tạo thư mục WebMovie
async function setupWebMovieFolder() {
    try {
        // Tìm hoặc tạo thư mục WebMovie
        const webMovieFolder = await googleDriveService.findOrCreateFolder('WebMovie');
        
        console.log('Thư mục WebMovie đã được thiết lập:');
        console.log(`- ID: ${webMovieFolder.id}`);
        console.log(`- Tên: ${webMovieFolder.name}`);
        console.log(`- Trạng thái: ${webMovieFolder.isNew ? 'Mới tạo' : 'Đã tồn tại'}`);
        
        // Lưu ID của thư mục vào biến môi trường hoặc file config
        console.log('\nThêm ID này vào file .env của bạn:');
        console.log(`GOOGLE_DRIVE_MOVIE_FOLDER_ID=${webMovieFolder.id}`);
        
        return webMovieFolder;
    } catch (error) {
        console.error('Lỗi khi thiết lập thư mục WebMovie:', error);
        throw error;
    }
}

// Chạy hàm khởi tạo
setupWebMovieFolder();