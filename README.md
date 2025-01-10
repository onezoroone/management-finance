Dự án quản lý tài chính cá nhân thông minh - Nhóm 2 Cụm 2

- Các gói cần thiết cho hệ thống:
  + Mysql
  + Php >= 8.2
  + Composer >= 2.8
  + Nodejs >= 20.x
- Cách cài đặt:
  + Vào folder backend: sửa thông tin env như thông tin database, cài đặt thư viện bằng lệnh "composer install" => "php artisan migrate" => "php artisan db:seed"
  + Vào folder frontend: Thêm file .env.local thêm thuộc tính NEXT_PUBLIC_API_URL= điền domain backend vào, cài thư viện bằng lệnh "npm install"
  + Lệnh chạy backend: "php artisan server", lệnh chạy frontend: "npm run dev"
