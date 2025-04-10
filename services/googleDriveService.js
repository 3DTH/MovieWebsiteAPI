const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

// Cấu hình Google Drive API
const SCOPES = ['https://www.googleapis.com/auth/drive'];
const TOKEN_PATH = path.join(__dirname, '../config/token.json');
const CREDENTIALS_PATH = path.join(__dirname, '../config/credentials.json');

// Tạo OAuth2 client
const authorize = async () => {
    const content = fs.readFileSync(CREDENTIALS_PATH);
    const credentials = JSON.parse(content);
    const { client_secret, client_id, redirect_uris } = credentials.web;
    const oAuth2Client = new google.auth.OAuth2(
        client_id, client_secret, redirect_uris[0]
    );

    // Kiểm tra token đã tồn tại chưa
    if (fs.existsSync(TOKEN_PATH)) {
        const token = fs.readFileSync(TOKEN_PATH);
        oAuth2Client.setCredentials(JSON.parse(token));
        return oAuth2Client;
    } else {
        // Nếu chưa có token, bạn cần tạo token mới
        throw new Error('Token không tồn tại, hãy chạy generateToken.js trước');
    }
};

const googleDriveService = {
    // Tạo thư mục mới trong Google Drive
    createFolder: async (folderName, parentFolderId = null) => {
        try {
            const auth = await authorize();
            const drive = google.drive({ version: 'v3', auth });
            
            const fileMetadata = {
                name: folderName,
                mimeType: 'application/vnd.google-apps.folder'
            };
            
            // Nếu có parentFolderId, thêm folder vào thư mục cha
            if (parentFolderId) {
                fileMetadata.parents = [parentFolderId];
            }
            
            const response = await drive.files.create({
                resource: fileMetadata,
                fields: 'id, name'
            });
            
            // Cấp quyền cho folder (ai có link đều xem được)
            await drive.permissions.create({
                fileId: response.data.id,
                requestBody: {
                    role: 'reader',
                    type: 'anyone'
                }
            });
            
            return {
                id: response.data.id,
                name: response.data.name
            };
        } catch (error) {
            console.error('Lỗi khi tạo thư mục:', error);
            throw error;
        }
    },
    
    // Tìm thư mục theo tên
    findFolder: async (folderName) => {
        try {
            const auth = await authorize();
            const drive = google.drive({ version: 'v3', auth });
            
            // Tìm kiếm thư mục theo tên và mime type
            const response = await drive.files.list({
                q: `name='${folderName}' and mimeType='application/vnd.google-apps.folder' and trashed=false`,
                fields: 'files(id, name)',
                spaces: 'drive'
            });
            
            return response.data.files;
        } catch (error) {
            console.error('Lỗi khi tìm thư mục:', error);
            throw error;
        }
    },
    
    // Tìm hoặc tạo thư mục (nếu không tồn tại)
    findOrCreateFolder: async (folderName, parentFolderId = null) => {
        try {
            // Tìm thư mục trước
            const folders = await googleDriveService.findFolder(folderName);
            
            // Nếu thư mục đã tồn tại, trả về thư mục đầu tiên
            if (folders && folders.length > 0) {
                return {
                    id: folders[0].id,
                    name: folders[0].name,
                    isNew: false
                };
            }
            
            // Nếu không tìm thấy, tạo thư mục mới
            const newFolder = await googleDriveService.createFolder(folderName, parentFolderId);
            return {
                ...newFolder,
                isNew: true
            };
        } catch (error) {
            console.error('Lỗi khi tìm hoặc tạo thư mục:', error);
            throw error;
        }
    },
    
    // Upload file từ buffer lên Google Drive
    uploadFileFromBuffer: async (buffer, fileName, mimeType, folderId = null) => {
        try {
            const auth = await authorize();
            const drive = google.drive({ version: 'v3', auth });
            
            const fileMetadata = {
                name: fileName
            };
            
            if (folderId) {
                fileMetadata.parents = [folderId];
            }
            
            const media = {
                mimeType: mimeType,
                body: require('stream').Readable.from(buffer)
            };
            
            const response = await drive.files.create({
                resource: fileMetadata,
                media: media,
                fields: 'id, name, size, mimeType'
            });
            
            // Cấp quyền cho file (ai có link đều xem được)
            await drive.permissions.create({
                fileId: response.data.id,
                requestBody: {
                    role: 'reader',
                    type: 'anyone'
                }
            });
            
            return {
                fileId: response.data.id,
                fileName: response.data.name,
                fileSize: response.data.size,
                mimeType: response.data.mimeType,
                embedUrl: `https://drive.google.com/file/d/${response.data.id}/preview`,
                downloadUrl: `https://drive.google.com/uc?export=download&id=${response.data.id}`
            };
        } catch (error) {
            console.error('Lỗi khi upload file từ buffer lên Google Drive:', error);
            throw error;
        }
    },
    
    // Xóa file hoặc thư mục từ Google Drive
    deleteFile: async (fileId) => {
        try {
            const auth = await authorize();
            const drive = google.drive({ version: 'v3', auth });
            
            await drive.files.delete({
                fileId: fileId
            });
            
            return true;
        } catch (error) {
            console.error('Lỗi khi xóa file từ Google Drive:', error);
            throw error;
        }
    },
    
};

module.exports = googleDriveService;
