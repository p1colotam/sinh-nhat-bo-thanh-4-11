# Chiến dịch đặc biệt: Nụ cười của bố

Website sinh nhật dành tặng bố Nguyễn Chí Thanh ngày 04/11.

## GitHub Pages

Kho mã nguồn: `p1colotam/sinh-nhat-bo-thanh-4-11`.
Trang đã xuất bản tại `https://p1colotam.github.io/sinh-nhat-bo-thanh-4-11/`. Mỗi lần đẩy thay đổi lên nhánh `main`, GitHub Actions sẽ tự xây dựng và cập nhật trang.

## Chạy trên máy

```sh
npm install
npm run dev
```

## Thêm nội dung cá nhân

1. Đặt ảnh gia đình trong `public/media/`.
2. Mở `src/content.js` và dùng đường dẫn tương đối qua `mediaUrl` (ví dụ `mediaUrl('media/anh-gia-dinh.jpg')`).
3. Chạy `npm run build` để kiểm tra trước khi cập nhật bản xuất bản.

## Nhạc nền

Trang phát tệp `public/media/khuc-hat-mung-sinh-nhat.m4a` của “Khúc Hát Mừng Sinh Nhật” do Phan Đinh Tùng trình bày. Trang thử phát khi mở và thử lại khi người xem nhấn “Mở quà thui nào 🎁”; nút trong thanh đầu trang cho phép bật/tắt. Một số trình duyệt yêu cầu người xem chạm nút trước khi phát nhạc.
