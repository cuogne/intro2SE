const movies = [
  {
    title: 'PHI VỤ ĐỘNG TRỜI 2 (P) LT',
    minutes: 117,
    genre: ['Hoạt hình'],
    releaseDate: new Date('2025-11-28'),
    posterImg: 'https://api-website.cinestar.com.vn/media/wysiwyg/Posters/11-2025/zootopia-2_1.jpg',
    trailerLink: 'https://youtu.be/5O3LEps6WJY',
    description:
      'ZOOTOPIA 2 trở lại sau 9 năm Đu OTP Nick & Judy chuẩn bị 28.11.2025 này ra rạp nhé',
    status: 'now_showing',
  },
  {
    title: '5 CENTIMET TRÊN GIÂY (T13)',
    minutes: 76,
    genre: ['Tình Cảm', 'Anime'],
    releaseDate: new Date('2025-12-04'),
    posterImg: 'https://api-website.cinestar.com.vn/media/wysiwyg/Posters/12-2025/5cm.jpg',
    trailerLink: 'https://youtu.be/WI0_CiynFW8',
    description:
      'Câu chuyện cảm động về Takaki và Akari, đôi bạn thuở thiếu thời dần bị chia cắt bởi thời gian và khoảng cách. Qua ba giai đoạn khác nhau trong cuộc đời, hành trình khắc họa những ký ức, cuộc hội ngộ và sự xa cách của cặp đôi, với hình ảnh hoa anh đào rơi – 5cm/giây – như ẩn dụ cho tình yêu mong manh và thoáng chốc của tuổi trẻ.',
    status: 'now_showing',
  },
  {
    title: 'TRUY TÌM LONG DIÊN HƯƠNG (T16)',
    minutes: 103,
    genre: ['Hài', 'Hành Động'],
    releaseDate: new Date('2025-12-04'),
    posterImg:
      'https://api-website.cinestar.com.vn/media/wysiwyg/Posters/11-2025/truy-tien-long-dien-huong-poster.jpg',
    trailerLink: 'https://youtu.be/fO6X58qWA_s',
    description:
      'Ngay trước thềm lễ hội lớn, bảo vật linh thiêng Long Diên Hương bất ngờ bị đánh cắp, kéo theo hai anh em Tâm - Tuấn cùng nhóm bạn vào chuyến hành trình nghẹt thở nhưng không kém phần hài hước khi họ phải chạm trán với các băng nhóm ngư dân xã hội đen cùng nhiều hiểm nguy.',
    status: 'comming_soon',
  },
  {
    title: 'PHÒNG TRỌ MA BẦU (T16)',
    minutes: 102,
    genre: ['Hài', 'Kinh Dị'],
    releaseDate: new Date('2025-12-04'),
    posterImg:
      'https://api-website.cinestar.com.vn/media/wysiwyg/Posters/11-2025/phong-tro-ma-bay-payoff.jpg',
    trailerLink: 'https://youtu.be/aCI_-1TNlkk',
    description:
      'Hai người bạn thân thuê phải một căn phòng trọ cũ, nơi liên tục xảy ra những hiện tượng kỳ bí. Trong hành trình tìm hiểu, họ đối mặt với hồn ma của một người phụ nữ mang thai – "ma bầu". Ẩn sau nỗi ám ảnh rùng rợn là bi kịch và tình yêu mẫu tử thiêng liêng, nơi sự hy sinh của người mẹ trở thành sợi dây kết nối những thế hệ.',
    status: 'now_showing',
  },
  {
    title: 'PHIM ĐIỆN ẢNH THÁM TỬ LỪNG DANH CONAN (K) PĐ: DƯ ẢNH CỦA ĐỘC NHÃN (K) PĐ',
    minutes: 110,
    genre: ['Hoạt hình', 'Anime'],
    releaseDate: new Date('2025-12-06'),
    posterImg: 'https://api-website.cinestar.com.vn/media/wysiwyg/Posters/11-2025/conan-rerun.jpg',
    trailerLink: 'https://youtu.be/8mzX34aQjkQ',
    description:
      'Trên những ngọn núi tuyết của Nagano, một vụ án bí ẩn đã đưa Conan và các thám tử quay trở lại quá khứ. Thanh tra Yamato Kan…oro nhận được một cuộc gọi từ một đồng nghiệp cũ, tiết lộ mối liên hệ đáng ngờ giữa anh ta và vụ án đã bị lãng quên từ lâu.',
    status: 'comming_soon',
  },
  {
    title: 'CHÚ THUẬT HỒI CHIẾN: BIẾN CỐ SHIBUYA x TỬ DIỆT HỒI DU (T16)',
    minutes: 88,
    genre: ['Anime'],
    releaseDate: new Date('2025-12-05'),
    posterImg:
      'https://api-website.cinestar.com.vn/media/wysiwyg/Posters/12-2025/jujutsu-kaisen.jpg',
    trailerLink: 'https://youtu.be/nGVYzNPMrvE',
    description:
      'Sau bao ngày chờ đợi, Đại Chiến Shibuya cuối cùng cũng xuất hiện trên màn ảnh rộng, gom trọn những khoảnh khắc nghẹt thở nhất thành một cú nổ đúng nghĩa. Không chỉ tái hiện toàn bộ cơn ác mộng tại Shibuya, bộ phim còn hé lộ những bí mật then chốt và mở màn cho trò chơi sinh tử "Tử Diệt Hồi Du" đầy kịch tính và mãn nhãn.',
    status: 'now_showing',
  },
  {
    title: 'KUMANTHONG NHẬT BẢN: VONG NHI CÚP BẾ (T16)',
    minutes: 110,
    genre: ['Kinh Dị'],
    releaseDate: new Date('2025-12-12'),
    posterImg: 'https://api-website.cinestar.com.vn/media/wysiwyg/Posters/12-2025/doll-house.png',
    trailerLink: 'https://youtu.be/fg6KrH2h1MQ',
    description:
      'Suzuki Yoshie bỗng tìm thấy một con búp bê giống với đứa con gái đã mất của mình, vì quá đau buồn mà vợ chồng cô đã chăm sóc con búp bê trong suốt nhiều năm. Sự việc kinh hoàng xảy ra khi cô phát hiện mình đã có thai, và dường như con búp bê của cô không muốn chia sẻ tình thương với "đứa em" sơ sinh đó.',
    status: 'comming_soon',
  },
  {
    title: '96 PHÚT SINH TỬ (T16) LT',
    minutes: 119,
    genre: ['Hành Động'],
    releaseDate: new Date('2025-12-05'),
    posterImg: 'https://api-website.cinestar.com.vn/media/wysiwyg/Posters/12-2025/96M.jpg',
    trailerLink: 'https://youtu.be/H9U8H01_olw',
    description:
      'Ba năm sau thảm kịch tại trung tâm mua sắm, trên chuyến tàu cao tốc định mệnh, nữ cảnh sát Huỳnh Hân (Tống Vân Hoa) và chồng cô là cựu chuyên gia gỡ bom - Tống Khang Nhân (Lâm Bách Hoành), cùng đội trưởng Lý Kiệt (Lý Lý Nhân) bất ngờ nhận được tin nhắn thông báo một quả bom đã được cài sẵn trên tàu. Vụ việc lần này còn phức tạp hơn khi kẻ khủng bố dường tính toán vô cùng tinh vi. Khi thời gian cạn dần, Tống Khang Nhân buộc phải ngăn thảm kịch xảy ra bằng mọi giá, đồng thời đối mặt với những ám ảnh kinh hoàng từ vụ nổ năm xưa.',
    status: 'now_showing',
  },
  {
    title: 'PHIÊN CHỢ CỦA QUỶ (T18)',
    minutes: 97,
    genre: ['Kinh Dị'],
    releaseDate: new Date('2025-11-28'),
    posterImg:
      'https://api-website.cinestar.com.vn/media/wysiwyg/Posters/12-2025/phien-cho-cua-quy.jpg',
    trailerLink: 'https://youtu.be/dLmJv83Djyc',
    description:
      'Phiên chợ của quỷ - Nơi linh hồn trở thành những món hàng để thỏa mãn tham vọng của con người. Mỗi đêm, cổng chợ âm sẽ mở, quỷ sẽ bắt hồn. Một khi đã dám bán rẻ linh hồn, cái giá phải trả có thể là máu, là thịt, hoặc chính sự tồn tại của những kẻ dám liều mạng. Nỗi ám ảnh không lối thoát với phim tâm linh - kinh hợp tác Việt - Hàn quỷ dị nhất dịp cuối năm!',
    status: 'now_showing',
  },
  {
    title: 'NĂM ĐÊM KINH HOÀNG 2 (T16)',
    minutes: 104,
    genre: ['Hồi Hộp', 'Kinh Dị'],
    releaseDate: new Date('2025-12-05'),
    posterImg:
      'https://api-website.cinestar.com.vn/media/wysiwyg/Posters/12-2025/nam-dem-kinh-hoang.png',
    trailerLink: '',
    description:
      "Một năm sau cơn ác mộng siêu nhiên tại Freddy Fazbear's Pizza, thị trấn tổ chức lễ hội Fazfest lấy cảm hứng từ truyền thuyết địa phương xoay quanh sự kiện đó. Cựu nhân viên bảo vệ Mike và cảnh sát Vanessa che giấu sự thật với em gái 11 tuổi của Mike, Abby, về số phận của những người bạn animatronic của cô bé. Khi Abby lén đến gặp lại Freddy, Bonnie, Chica và Foxy, một chuỗi sự kiện kinh hoàng bắt đầu, làm lộ ra những bí mật đen tối về nguồn gốc thật sự của Freddy's, đồng thời giải phóng một nỗi kinh hoàng bị lãng quên suốt nhiều thập kỷ.",
    status: 'now_showing',
  },
  {
    title: 'GANGSTER VỀ LÀNG (T16) LT',
    minutes: 102,
    genre: ['Hài'],
    releaseDate: new Date('2025-11-28'),
    posterImg:
      'https://api-website.cinestar.com.vn/media/wysiwyg/Posters/11-2025/gangster-ve-lang.jpg',
    trailerLink: 'https://youtu.be/6P5Nt6RdeZY',
    description:
      'Câu chuyện về một kẻ sát nhân ẩn náu trong một ngôi làng yên bình ở vùng quê, khi chỉ còn 30 ngày nữa là hết thời hiệu truy tố.',
    status: 'now_showing',
  },
  {
    title: 'PHI VỤ THẾ KỶ: THOẮT ẨN THOẮT HIỆN (T13)',
    minutes: 113,
    genre: ['Hồi Hộp'],
    releaseDate: new Date('2025-11-28'),
    posterImg: 'https://api-website.cinestar.com.vn/media/wysiwyg/Posters/11-2025/phi-vu-the-ki.png',
    trailerLink: 'https://youtu.be/rt8tzGFN-Fk',
    description:
      'Tứ Kỵ Sĩ chính thức tái xuất, bắt tay cùng các tân binh ảo thuật gia Gen Z trong một phi vụ đánh cắp kim cương liều lĩnh nhất trong sự nghiệp. Họ phải đối đầu với bà trùm Veronika của đế chế rửa tiền nhà Vandenberg (do Rosamund Pike thủ vai) - một người phụ nữ quyền lực và đầy thủ đoạn. Khi kinh nghiệm lão làng của bộ tứ ảo thuật va chạm với công nghệ 4.0 của một mạng lưới tội phạm xuyên lục địa, liệu ai sẽ làm chủ cuộc chơi? Hãy chuẩn bị tinh thần cho những cú xoắn não mà bạn không thể đoán trước!',
    status: 'now_showing',
  },
];

module.exports = movies;
