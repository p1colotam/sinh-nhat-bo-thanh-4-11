# Chiến dịch đặc biệt: Nụ cười của bố

Website sinh nhật dành tặng bố Nguyễn Chí Thanh ngày 04/11.

## GitHub Pages

Kho mã nguồn dự kiến: `p1colotam/sinh-nhat-bo-thanh-4-11`.
Sau khi đẩy nhánh `main`, vào **Settings → Pages → Build and deployment** và chọn **GitHub Actions**. Workflow sẽ tự xây dựng và xuất bản trang tại `https://p1colotam.github.io/sinh-nhat-bo-thanh-4-11/`.

## Chạy trên máy

```sh
npm install
npm run dev
```

## Thêm nội dung cá nhân

1. Đặt ảnh gia đình trong `public/media/`.
2. Mở `src/content.js` và điền đường dẫn ảnh ở các mục `memories` (ví dụ `/media/anh-gia-dinh.jpg`).
3. Chạy `npm run build` để kiểm tra trước khi cập nhật bản xuất bản.

## Nhạc nền

Trang phát tệp `public/media/khuc-hat-mung-sinh-nhat.m4a` của “Khúc Hát Mừng Sinh Nhật” do Phan Đinh Tùng trình bày. Trang thử phát khi mở và thử lại khi người xem nhấn “Mở quà thui nào 🎁”; nút trong thanh đầu trang cho phép bật/tắt. Một số trình duyệt yêu cầu người xem chạm nút trước khi phát nhạc.
