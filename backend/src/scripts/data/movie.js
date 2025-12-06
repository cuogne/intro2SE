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
    status: 'now_showing',
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
    status: 'now_showing',
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
    status: 'now_showing',
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
    posterImg:
      'https://api-website.cinestar.com.vn/media/wysiwyg/Posters/11-2025/phi-vu-the-ki.png',
    trailerLink: 'https://youtu.be/rt8tzGFN-Fk',
    description:
      'Tứ Kỵ Sĩ chính thức tái xuất, bắt tay cùng các tân binh ảo thuật gia Gen Z trong một phi vụ đánh cắp kim cương liều lĩnh nhất trong sự nghiệp. Họ phải đối đầu với bà trùm Veronika của đế chế rửa tiền nhà Vandenberg (do Rosamund Pike thủ vai) - một người phụ nữ quyền lực và đầy thủ đoạn. Khi kinh nghiệm lão làng của bộ tứ ảo thuật va chạm với công nghệ 4.0 của một mạng lưới tội phạm xuyên lục địa, liệu ai sẽ làm chủ cuộc chơi? Hãy chuẩn bị tinh thần cho những cú xoắn não mà bạn không thể đoán trước!',
    status: 'now_showing',
  },
  {
    title: 'AVATAR 3: LỬA VÀ TRO TÀN',
    minutes: 197,
    genre: ['Phiêu Lưu', 'Hành Động', 'Khoa Học Viễn Tưởng'],
    releaseDate: new Date('2025-12-19'),
    posterImg: 'https://api-website.cinestar.com.vn/media/wysiwyg/Posters/12-2025/avatar-3_1.jpg',
    trailerLink: 'https://youtu.be/7l4hqTPpNyk',
    description: 'Một hành trình mới khởi đầu từ tro tàn.',
    status: 'now_showing',
  },
  {
    title: 'HOÀNG TỬ QUỶ (T18)',
    minutes: 117,
    genre: ['Kinh Dị'],
    releaseDate: new Date('2025-12-05'),
    posterImg:
      'https://api-website.cinestar.com.vn/media/wysiwyg/Posters/12-2025/hoang-tu-quy-main.png',
    trailerLink: 'https://youtu.be/oLxbSoA389c',
    description:
      'Hoàng Tử Quỷ xoay quanh Thân Đức - một hoàng tử được sinh ra nhờ tà thuật. Trốn thoát khỏi cung cấm, Thân Đức tham vọng giải thoát Quỷ Xương Cuồng khỏi Ải Mắt Người để khôi phục Xương Cuồng Giáo. Nhưng kế hoạch của Thân Đức chỉ thành hiện thực khi hắn có đủ cả hai “nguyên liệu” - Du Hồn Giả và Bạch Hổ Nguyên Âm. Đội lốt một lang y hiền lành, muốn chữa bệnh cứu người, Thân Đức lên đường đến làng Hủi và đụng độ trưởng làng Lỗ Đạt mạnh mẽ, liệu hắn có thể đạt được âm mưu tà ác của mình?',
    status: 'now_showing',
  },
  {
    title: 'QUÁN KỲ NAM (T16)',
    minutes: 135,
    genre: ['Tâm Lý'],
    releaseDate: new Date('2025-11-28'),
    posterImg:
      'https://api-website.cinestar.com.vn/media/wysiwyg/Posters/11-2025/quan-ky-nam-poster.jpg',
    trailerLink: 'https://youtu.be/27dgpqiI0VU',
    description:
      'Với sự nâng đỡ của người chú quyền lực, Khang được giao cho công việc dịch cuốn “Hoàng Tử Bé” và dọn vào căn hộ bỏ trống ở khu chung cư cũ. Anh làm quen với cô hàng xóm tên Kỳ Nam, một góa phụ từng nổi danh trong giới nữ công gia chánh và giờ lặng lẽ với nghề nấu cơm tháng. Một tai nạn xảy ra khiến Kỳ Nam không thể tiếp tục công việc của mình. Khang đề nghị giúp đỡ và mối quan hệ của họ dần trở nên sâu sắc, gắn bó. Liệu mối quan hệ của họ có thể tồn tại lâu dài giữa những biến động củа xã hội thời bấy giờ?',
    status: 'now_showing',
  },
  {
    title: 'PHÒNG TRỌ MA BẦU (T16)',
    minutes: 102,
    genre: ['Hài', 'Kinh Dị'],
    releaseDate: new Date('2025-11-28'),
    posterImg:
      'https://api-website.cinestar.com.vn/media/wysiwyg/Posters/11-2025/phong-tro-ma-bay-payoff.jpg',
    trailerLink: 'https://youtu.be/aCI_-1TNlkk',
    description:
      'Hai người bạn thân thuê phải một căn phòng trọ cũ, nơi liên tục xảy ra những hiện tượng kỳ bí. Trong hành trình tìm hiểu, họ đối mặt với hồn ma của một người phụ nữ mang thai – “ma bầu”. Ẩn sau nỗi ám ảnh rùng rợn là bi kịch và tình yêu mẫu tử thiêng liêng, nơi sự hy sinh của người mẹ trở thành sợi dây kết nối những thế hệ.',
    status: 'now_showing',
  },
  {
    title: 'PHI VỤ ĐỘNG TRỜI 2 (P) (PĐ)',
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
    title: 'KỲ AN NGHỈ (T18)',
    minutes: 99,
    genre: ['Kinh Dị'],
    releaseDate: new Date('2025-11-21'),
    posterImg: 'https://api-website.cinestar.com.vn/media/wysiwyg/Posters/11-2025/ky-an-nghi.jpg',
    trailerLink: 'https://youtu.be/JJZU5ZXKEnk',
    description:
      'Liz và Malcolm quyết định kỷ niệm ngày đặc biệt của họ tại căn cabin hẻo lánh giữa rừng sâu, nơi thuộc về Malcolm. Khung cảnh yên tĩnh ban đầu mang lại cảm giác bình yên và lãng mạn, cho đến khi Malcolm nhận cuộc gọi khẩn và buộc phải quay lại thành phố, để Liz ở lại một mình. Khi màn đêm buông xuống, những âm thanh kỳ lạ vang lên từ trong bóng tối, và Liz cảm nhận có một thứ gì đó đang dõi theo mình. Một thực thể tà ác dần lộ diện, kéo cô vào chuỗi bí mật kinh hoàng bị chôn vùi trong lịch sử của căn cabin. Ranh giới giữa thực và ảo trở nên mờ nhạt, và Liz phải chiến đấu để sống sót — cũng như khám phá lời nguyền ám ảnh nơi này suốt bao năm qua.',
    status: 'now_showing',
  },
  {
    title: 'CƯỚI VỢ CHO CHA (T13)',
    minutes: 112,
    genre: ['Hài', 'Gia đình'],
    releaseDate: new Date('2025-11-21'),
    posterImg:
      'https://api-website.cinestar.com.vn/media/wysiwyg/Posters/11-2025/cuoi-vo-cho-cha-poster.png',
    trailerLink: 'https://youtu.be/1ffxVmHB4Hk',
    description:
      'Ở một xóm nhỏ miền Tây, ông Sáu Sếu sống lủi thủi trong quán cà phê – karaoke, mong con trai Út Tửng từ Sài Gòn về thăm. Khi phát hiện mình mắc trọng bệnh, ông quyết “cưới vợ cho con” để trọn lời hứa với người vợ quá cố. Nhưng kế hoạch ấy đổ vỡ khi ông phát hiện Tửng có một bí mật động trời và che giấu mọi chuyện. Giữa những xung đột, hiểu lầm và nỗ lực hàn gắn, cha con họ dần học cách thấu hiểu, để rồi mỗi người đều tìm thấy hạnh phúc và bình yên trong chính cuộc hôn nhân của mình.',
    status: 'now_showing',
  },
  {
    title: 'TAFITI - NÁO LOẠN SA MẠC (P) LT',
    minutes: 80,
    genre: ['Hoạt hình'],
    releaseDate: new Date('2025-11-21'),
    posterImg: 'https://api-website.cinestar.com.vn/media/wysiwyg/Posters/11-2025/tafiti.jpg',
    trailerLink: 'https://youtu.be/n9Jv1bEjSgk',
    description:
      'Chú chồn đất Tafiti vốn chỉ mong một cuộc sống yên bình giữa thảo nguyên nhưng cứ bị chú heo rừng hậu đậu, tốt bụng Bristles làm đảo lộn mọi thứ. Khi ông nội không may bị rắn độc cắn, Tafiti buộc phải vượt qua sa mạc khắc nghiệt để tìm bông hoa xanh hiếm có nhằm cứu ông. Chuyến phiêu lưu đầy tiếng cười và thử thách cùng Bristles giúp Tafiti nhận ra rằng điều quý giá nhất trong mọi hành trình không phải là đích đến, mà là những người bạn đồng hành bên cạnh.',
    status: 'now_showing',
  },
  {
    title: '100 MÉT (P)',
    minutes: 106,
    genre: ['Anime'],
    releaseDate: new Date('2025-11-28'),
    posterImg: 'https://api-website.cinestar.com.vn/media/wysiwyg/Posters/11-2025/100m-poster.jpg',
    trailerLink: 'https://youtu.be/g38X4oSElkg',
    description:
      '"Kiệt Tác Rotoscoping” (vẽ lại dựa trên cảnh quay người thật) khi tạo nên những phân cảnh chi tiết với độ chân thực đáng kinh ngạc - Bộ Phim 100 MÉT là câu chuyện kéo dài hơn 15 năm, xoay quanh hai vận động viên chạy nước rút có xuất phát điểm trái ngược nhau: ​Togashi: Một "thiên tài" bẩm sinh về chạy bộ. Ngay từ khi còn nhỏ, cậu đã luôn chiến thắng mọi cuộc đua 100m một cách dễ dàng mà không cần nỗ lực nhiều.​Komiya: Một học sinh chuyển trường, người có thừa sự quyết tâm và đam mê nhưng lại thiếu kỹ thuật.​Khi còn học lớp 6, Togashi đã gặp và truyền cảm hứng cho Komiya. Nhiều năm trôi qua, họ gặp lại nhau trên đường đua với tư cách là đối thủ lớn nhất của nhau. Bộ phim đào sâu vào sự cạnh tranh, áp lực tâm lý, những chấn thương, và hành trình đầy khắc nghiệt của các vận động viên chuyên nghiệp để tìm ra ý nghĩa thực sự của việc chạy.',
    status: 'now_showing',
  },
  {
    title: 'PHIM ĐIỆN ẢNH THÁM TỬ LỪNG DANH CONAN (K) LT: DƯ ẢNH CỦA ĐỘC NHÃN (K) LT',
    minutes: 110,
    genre: ['Hoạt hình', 'Anime'],
    releaseDate: new Date('2025-11-28'),
    posterImg: 'https://api-website.cinestar.com.vn/media/wysiwyg/Posters/11-2025/conan-rerun.jpg',
    trailerLink: '',
    description:
      'Trên những ngọn núi tuyết của Nagano, một vụ án bí ẩn đã đưa Conan và các thám tử quay trở lại quá khứ. Thanh tra Yamato Kansuke - người đã bị thương nặng trong một trận tuyết lở nhiều năm trước - bất ngờ phải đối mặt với những ký ức đau thương của mình trong khi điều tra một vụ tấn công tại Đài quan sát Nobeyama. Cùng lúc đó, Mori Kogoro nhận được một cuộc gọi từ một đồng nghiệp cũ, tiết lộ mối liên hệ đáng ngờ giữa anh ta và vụ án đã bị lãng quên từ lâu.',
    status: 'now_showing',
  },
  {
    title: 'ANH TRAI SAY XE (T16) LT',
    minutes: 110,
    genre: ['Hài', 'Gia đình'],
    releaseDate: new Date('2025-11-21'),
    posterImg:
      'https://api-website.cinestar.com.vn/media/wysiwyg/Posters/11-2025/anh-trai-say-xe.jpg',
    trailerLink: 'https://youtu.be/15FPFsXcR-c',
    description:
      '“Đã bao lâu bạn chưa du lịch cùng bạn thân?” Nhóm bạn nối khố của Tae Jeong, Do Jin, Yeon Min và Geum Bok đã ấp ủ một chuyến du lịch cùng nhau ngay sau khi tốt nghiệp cấp III, thế nhưng rốt cuộc vì thế này thế kia mà cả bọn đã lỡ hẹn. Hơn mười năm sau, người phải “bán mình cho tư bản”, người thì xuất gia, người đi định cư, có người lại mắc cả bệnh tâm lý. Nhưng nhóm “bốn thằng cốt” vẫn quyết định cùng nhau thực hiện lời hứa chuyến xuất ngoại đầu tiên. Bốn “anh trai say xe” này đã quậy tưng Bangkok, biến “chuyến đi đầu tiên” thành một kỉ niệm nhớ đời với vô vàn kịch tính lẫn tiếng cười, nước mắt. Nhất là khi, cô nàng vô duyên Ok Sim còn bám riết như kỳ đà!?  Lần đầu tiên trên màn ảnh rộng, hai tài tử Kang Ha Neul và Cha Eun Woo bắt tay nhau tạo nên những thước phim thanh xuân mãn nhãn và đẩy cảm xúc.',
    status: 'now_showing',
  },
  {
    title: 'ANH TRAI SAY XE (T16) PĐ',
    minutes: 110,
    genre: ['Hài', 'Gia đình'],
    releaseDate: new Date('2025-11-21'),
    posterImg:
      'https://api-website.cinestar.com.vn/media/wysiwyg/Posters/11-2025/anh-trai-say-xe.jpg',
    trailerLink: 'https://youtu.be/15FPFsXcR-c',
    description:
      '“Đã bao lâu bạn chưa du lịch cùng bạn thân?” Nhóm bạn nối khố của Tae Jeong, Do Jin, Yeon Min và Geum Bok đã ấp ủ một chuyến du lịch cùng nhau ngay sau khi tốt nghiệp cấp III, thế nhưng rốt cuộc vì thế này thế kia mà cả bọn đã lỡ hẹn. Hơn mười năm sau, người phải “bán mình cho tư bản”, người thì xuất gia, người đi định cư, có người lại mắc cả bệnh tâm lý. Nhưng nhóm “bốn thằng cốt” vẫn quyết định cùng nhau thực hiện lời hứa chuyến xuất ngoại đầu tiên. Bốn “anh trai say xe” này đã quậy tưng Bangkok, biến “chuyến đi đầu tiên” thành một kỉ niệm nhớ đời với vô vàn kịch tính lẫn tiếng cười, nước mắt. Nhất là khi, cô nàng vô duyên Ok Sim còn bám riết như kỳ đà!?  Lần đầu tiên trên màn ảnh rộng, hai tài tử Kang Ha Neul và Cha Eun Woo bắt tay nhau tạo nên những thước phim thanh xuân mãn nhãn và đẩy cảm xúc.',
    status: 'now_showing',
  },
  {
    title: 'MA LỦNG TƯỜNG (T18)',
    minutes: 99,
    genre: ['Kinh Dị'],
    releaseDate: new Date('2025-12-05'),
    posterImg:
      'https://api-website.cinestar.com.vn/media/wysiwyg/Posters/12-2025/ma-lung-tuong-poster.jpg',
    trailerLink: 'https://youtu.be/7I-PtAD_TGM',
    description:
      'Một gia đình chết một cách khủng khiếp. Một cô gái bị buộc tội là kẻ giết người. Nhưng một sự thật kinh hoàng hơn đang chờ được tiết lộ. Cuộc chiến trừ tà đẫm máu và gây choáng nhất cuối năm giữa hậu duệ một gia tộc diệt quỷ cùng những thế lực tà ác khủng khiếp nhất xứ vạn đảo.',
    status: 'now_showing',
  },
  {
    title: '96 PHÚT SINH TỬ (T16) PĐ',
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
    title: 'SCARLET',
    minutes: 99,
    genre: ['Anime'],
    releaseDate: new Date('2025-12-12'),
    posterImg: 'https://api-website.cinestar.com.vn/media/wysiwyg/Posters/12-2025/scarlet.jpg',
    trailerLink: 'https://youtu.be/zh5y1QWIL-g',
    description:
      'Từ nhà làm phim thiên tài Mamoru Hosoda - người từng được đề cử giải Oscar® với bộ phim MIRAI. Scarlet mang đến một cuộc phiêu lưu hoạt hình kịch tính, vượt thời gian, xoay quanh Scarlet – nàng công chúa thời trung cổ với thanh kiếm trên tay, bước vào hành trình nguy hiểm để trả thù cho cái chết của cha mình.  Thất bại trong nhiệm vụ và bị thương nặng, Scarlet lạc vào vùng đất tử thần, nơi cô gặp một chàng trai đầy lý tưởng sống ở thời hiện đại. Anh không chỉ giúp cô hồi phục mà còn cho cô thấy viễn cảnh về một tương lai không còn đắng cay và thù hận. Khi một lần nữa đối mặt với kẻ đã giết cha, Scarlet phải bước vào trận chiến cam go nhất: Liệu cô có thể phá vỡ vòng lặp hận thù và tìm ra ý nghĩa của cuộc sống vượt lên trên sự trả thù?',
    status: 'now_showing',
  },
  {
    title: 'THẾ HỆ KỲ TÍCH (K)',
    minutes: 124,
    genre: ['Gia đình', 'Tâm Lý'],
    releaseDate: new Date('2025-12-12'),
    posterImg:
      'https://api-website.cinestar.com.vn/media/wysiwyg/Posters/12-2025/the-he-ky-tich.jpg',
    trailerLink: 'https://youtu.be/YH734HLCDpo',
    description:
      'Mồ côi cha mẹ từ nhỏ, Tiến – cậu thiếu niên sống cùng bà nội nơi phố cổ Hà Nội – phải học cách trưởng thành giữa nghèo khó, để rồi từ tình thương bà cháu tìm thấy nghị lực và khát vọng bước vào đời.',
    status: 'now_showing',
  },
  {
    title: 'MẮC BẪY LŨ TÍ QUẬY (P) LT',
    minutes: 80,
    genre: ['Hoạt hình'],
    releaseDate: new Date('2025-12-12'),
    posterImg:
      'https://api-website.cinestar.com.vn/media/wysiwyg/Posters/12-2025/mac-bay-lu-ti-quay.jpeg',
    trailerLink: 'https://youtu.be/kcjXkv2XeHI',
    description:
      'Một gia đình kéo nhau về căn nhà bỏ hoang của người dì để đón Giáng Sinh “đổi gió”, nhưng lại không hề biết họ sắp đối đầu… chủ nhà thực sự: một đại gia đình chuột đã định cư từ lâu và cực kỳ ghét bị làm phiền. Cuộc chiến giành lãnh thổ bùng nổ—bẫy giăng khắp nơi, ai nhanh hơn, ai thông minh hơn sẽ sống yên thân!',
    status: 'now_showing',
  },
  {
    title: 'VUA CỦA CÁC VUA (PĐ)',
    minutes: 99,
    genre: ['Hoạt hình'],
    releaseDate: new Date('2025-12-12'),
    posterImg:
      'https://api-website.cinestar.com.vn/media/wysiwyg/Posters/12-2025/vua-cua-cac-vua.png',
    trailerLink: 'https://youtu.be/6g5TvVyc65g',
    description:
      'Khi một bộ phim hoạt hình Hàn Quốc viết lại lịch sử phòng vé toàn cầu bằng câu chuyện từ Kinh Thánh. The King of Kings - Vua của Các Vua trở thành bộ phim hoạt hình dựa trên Kinh Thánh có doanh thu đạt kỷ lục toàn cầu, đồng thời chinh phục khán giả Bắc Mỹ với loạt điểm số ấn tượng: 98% Popcornmeter trên Rotten Tomatoes và A+ từ CinemaScore. Bộ phim không chỉ gây ấn tượng bởi thành tích đáng nể, mà còn bởi hành trình nơi niềm tin gặp gỡ nghệ thuật. Từng khung hình được chăm chút như một bức họa thiêng liêng, kể về tình yêu, phép màu và lòng biết ơn - những giá trị khiến bộ phim chạm đến trái tim hàng triệu khán giả. — The King Of Kings – Vua của Các Vua - Phim hoạt hình về cuộc đời Chúa Giê-su đầu tiên.',
    status: 'now_showing',
  },
  {
    title: 'PHIM ĐIỆN ẢNH ANH TRAI TÔI LÀ KHỦNG LONG: TƯƠNG LAI CỦA QUÁ KHỨ (T16) LT',
    minutes: 95,
    genre: ['Hoạt hình'],
    releaseDate: new Date('2025-12-12'),
    posterImg:
      'https://api-website.cinestar.com.vn/media/wysiwyg/Posters/12-2025/anh-trai-toi-la-khung-long.png',
    trailerLink: '',
    description:
      'Tưởng rằng ác quỷ đã bị diệt trừ, nhưng hắn đã trở lại — mạnh mẽ hơn, tàn nhẫn hơn. Khi thực tại sụp đổ, Phong và Nghi buộc phải bước vào hành trình ngược dòng thời gian, trở về thời khắc trước khi thảm họa bắt đầu. Giữa ranh giới của niềm tin và tuyệt vọng, họ chỉ có một cơ hội để thay đổi số phận loài người… dù phải đánh đổi chính sự tồn tại của mình. Kiếp nạn vượt thời gian của Phong và Nghi. Tương lai nào cho quá khứ? Phim điện ảnh Anh Trai Tôi Là Khủng Long sắp tới rồi, sắp tới rồi!',
    status: 'now_showing',
  },
  {
    title: 'VUA CỦA CÁC VUA (LT)',
    minutes: 99,
    genre: ['Hoạt hình'],
    releaseDate: new Date('2025-12-12'),
    posterImg:
      'https://api-website.cinestar.com.vn/media/wysiwyg/Posters/12-2025/vua-cua-cac-vua.png',
    trailerLink: 'https://youtu.be/6g5TvVyc65g',
    description:
      'Khi một bộ phim hoạt hình Hàn Quốc viết lại lịch sử phòng vé toàn cầu bằng câu chuyện từ Kinh Thánh. The King of Kings - Vua của Các Vua trở thành bộ phim hoạt hình dựa trên Kinh Thánh có doanh thu đạt kỷ lục toàn cầu, đồng thời chinh phục khán giả Bắc Mỹ với loạt điểm số ấn tượng: 98% Popcornmeter trên Rotten Tomatoes và A+ từ CinemaScore. Bộ phim không chỉ gây ấn tượng bởi thành tích đáng nể, mà còn bởi hành trình nơi niềm tin gặp gỡ nghệ thuật. Từng khung hình được chăm chút như một bức họa thiêng liêng, kể về tình yêu, phép màu và lòng biết ơn - những giá trị khiến bộ phim chạm đến trái tim hàng triệu khán giả. — The King Of Kings – Vua của Các Vua - Phim hoạt hình về cuộc đời Chúa Giê-su đầu tiên.',
    status: 'now_showing',
  },
  {
    title: 'EM SẼ KHỬ ANH (T18)',
    minutes: 118,
    genre: ['Hồi Hộp', 'Hài'],
    releaseDate: new Date('2025-12-12'),
    posterImg:
      'https://api-website.cinestar.com.vn/media/wysiwyg/Posters/12-2025/em-se-khu-anh.png',
    trailerLink: '',
    description:
      'Một cặp đôi trẻ đầy tình yêu và hy vọng (Grace và Jackson) rời New York để chuyển đến ngôi nhà thừa kế tại vùng quê yên tĩnh. Giữa không gian cô lập, Grace vật lộn với chứng trầm cảm sau sinh và cố gắng tìm lại chính mình trong vai trò người mẹ. Nhưng khi cô dần rơi vào trạng thái rạn vỡ và hỗn loạn, đó không phải vì yếu đuối, mà chính nhờ trí tưởng tượng, nghị lực và sức sống mãnh liệt hoang dã, cô tìm thấy lại con người thật của mình.',
    status: 'now_showing',
  },
  {
    title: 'CHỢ ĐEN THỜI TẬN THẾ',
    minutes: 99,
    genre: ['Hồi Hộp'],
    releaseDate: new Date('2025-12-19'),
    posterImg:
      'https://api-website.cinestar.com.vn/media/wysiwyg/Posters/12-2025/cho-den-thoi-tan-the.jpg',
    trailerLink: 'https://youtu.be/ktjCLQ0raB8',
    description:
      'Trong thế giới hậu tận thế sau trận động đất thảm khốc, một tòa nhà chung cư không bị sụp đổ đã trở thành một khu chợ trao đổi hàng hóa.',
    status: 'now_showing',
  },
  {
    title: 'ĐỤNG ĐỘ SIÊU TRĂN',
    minutes: 99,
    genre: ['Phiêu Lưu'],
    releaseDate: new Date('2025-12-25'),
    posterImg: 'https://api-website.cinestar.com.vn/media/wysiwyg/Posters/12-2025/Anaconda.jpg',
    trailerLink: 'https://youtu.be/vJiB77BGGxU',
    description:
      'Doug (Jack Black) và Griff (Paul Rudd) là đôi bạn thân từ nhỏ, họ đã luôn mơ ước được làm lại bộ phim yêu thích nhất của mình là bộ phim kinh điển Anaconda. Khi khủng hoảng tuổi trung niên thúc đẩy họ đã liều lĩnh thực hiện. Cả bọn lên đường tiến sâu vào rừng Amazon để bắt đầu quay phim. Nhưng mọi chuyện trở nên nguy hiểm khi một con trăn khổng lồ thực sự xuất hiện, biến phim trường hỗn loạn hài hước của họ thành một tình huống chết người. Bộ phim mà họ khao khát làm “gần chết” có lẽ sẽ khiến họ mất mạng thật...',
    status: 'now_showing',
  },
  {
    title: 'CÔ HẦU GÁI',
    minutes: 99,
    genre: ['Hồi Hộp'],
    releaseDate: new Date('2025-12-26'),
    posterImg: 'https://api-website.cinestar.com.vn/media/wysiwyg/Posters/12-2025/co-hau-gai.jpg',
    trailerLink: '',
    description:
      'Từ đạo diễn Paul Feig, một thế giới hỗn loạn sẽ mở ra, nơi sự hoàn hảo chỉ là ảo giác và mọi thứ dường như đều đang che đậy một bí mật đằng sau. Để chạy trốn khỏi quá khứ, Millie (Sydney Sweeney) trở thành bảo mẫu cho gia đình Nina (Amanda Seyfried) và Andrew (Brandon Sklener), một cặp đôi giàu có. Nhưng ngay khi cô chuyển vào sống chung và bắt đầu công việc "trong mơ", sự thật dần được hé lộ - đằng sau vẻ ngoài xa hoa lộng lẫy là mối nguy lớn hơn bất cứ thứ gì Millie có thể tưởng tượng. Một trò chơi đầy cám dỗ của bí mật và quyền lực sắp bắt đầu.',
    status: 'now_showing',
  },
  {
    title: 'THIÊN ĐƯỜNG MÁU',
    minutes: 99,
    genre: ['Tình Cảm', 'Hành Động'],
    releaseDate: new Date('2025-12-31'),
    posterImg:
      'https://api-website.cinestar.com.vn/media/wysiwyg/Posters/12-2025/thien-duong-mau-poster.png',
    trailerLink: 'https://youtu.be/QeLB2BuXaM0',
    description:
      'Thiên Đường Máu là phim điện ảnh đầu tiên về nạn lừa đảo người Việt ra nước ngoài. Tin lời hứa "việc nhẹ lương cao", không ít thanh niên bị đưa đến những "đặc khu", nơi họ trải qua cảnh giam lỏng và bị ép buộc phải gọi điện để lừa ngược lại chính đồng bào mình. Nhiều người trong số đó đã tìm cách đào thoát khỏi địa ngục mà họ đã trót dấn thân vào.',
    status: 'now_showing',
  },
  {
    title: 'AI THƯƠNG AI MẾN',
    minutes: 99,
    genre: ['Hài', 'Gia đình', 'Tâm Lý'],
    releaseDate: new Date('2026-01-01'),
    posterImg:
      'https://api-website.cinestar.com.vn/media/wysiwyg/Posters/01-2026/ai-men-ai-thuong-poster.jpeg',
    trailerLink: 'https://youtu.be/Z5QDdTiDgto',
    description:
      'Bộ phim lấy bối cảnh miền Tây sông nước năm 1960, kể về hành trình cuộc đời của Mến – người phụ nữ trải qua nhiều biến cố, thăng trầm để tìm lại ý nghĩa của yêu thương và bình yên trong cuộc sống.',
    status: 'now_showing',
  },
  {
    title: 'CON KỂ BA NGHE',
    minutes: 99,
    genre: ['Gia đình', 'Tâm Lý'],
    releaseDate: new Date('2026-01-16'),
    posterImg:
      'https://api-website.cinestar.com.vn/media/wysiwyg/Posters/01-2026/con-ke-ba-nghe-poster.jpg',
    trailerLink: 'https://youtu.be/AosY6TeYB_U',
    description:
      'Con Kể Ba Nghe theo chân một nghệ sĩ xiếc đi trên dây và cậu con trai khép kín trong hành trình tìm lại sự kết nối đã đánh mất. Giữa ánh đèn rực rỡ nhưng đầy mong manh của sân khấu xiếc, hai cha con dần mở lòng, chữa lành những tổn thương cũ. Bộ phim vừa tôn vinh nghề xiếc Việt Nam, vừa nhắc nhớ những giá trị gia đình trong nhịp sống hiện đại.',
    status: 'now_showing',
  },
  {
    title: 'MÙI PHỞ',
    minutes: 99,
    genre: ['Tình Cảm', 'Gia đình'],
    releaseDate: new Date('2026-02-17'),
    posterImg: 'https://api-website.cinestar.com.vn/media/wysiwyg/Posters/02-2026/mui-pho.jpg',
    trailerLink: '',
    description: '',
    status: 'now_showing',
  },
  {
    title: 'BÁU VẬT TRỜI CHO',
    minutes: 99,
    genre: ['Tình Cảm', 'Hài', 'Gia đình'],
    releaseDate: new Date('2026-02-17'),
    posterImg:
      'https://api-website.cinestar.com.vn/media/wysiwyg/Posters/02-2026/bau-vat-troi-cho.jpg',
    trailerLink: 'https://youtu.be/yiXKz5qFivc',
    description:
      'Bộ phim Gia Đình hoành tráng nhất Tết 2026 Khi cậu bé sáu tuổi trong một gia đình đơn thân vô tình tìm được “người cha trời cho” của mình. Hàng loạt bí mật và định mệnh trớ trêu bị lật mở, để rồi mỗi người phải tự hỏi: Điều gì mới thật sự là báu vật trời cho trong đời mình?',
    status: 'now_showing',
  },
  {
    title: 'PHIM SUPER MARIO THIÊN HÀ',
    minutes: 99,
    genre: ['Hoạt hình'],
    releaseDate: new Date('2026-04-03'),
    posterImg: 'https://api-website.cinestar.com.vn/media/wysiwyg/Posters/04-2026/mario.jpg',
    trailerLink: 'https://youtu.be/pY0u714WV3M',
    description:
      'Phim Super Mario Thiên Hà là một bộ phim hoạt hình được lấy bối cảnh trong thế giới của Anh Em Super Mario và là phần tiếp theo của Phim Anh Em Super Mario – tác phẩm ra mắt năm 2023 và đạt doanh thu hơn 1,3 tỷ đô la trên toàn cầu. Cả hai bộ phim Phim Anh Em Super Mario (2023) và Phim Super Mario Thiên Hà đều do Chris Meledandri (hãng Illumination) và Shigeru Miyamoto (từ Nintendo) đồng sản xuất.',
    status: 'now_showing',
  },
  {
    title: 'ĐẠI TIỆC TRĂNG MÁU 8',
    minutes: 99,
    genre: ['Drama', 'Hài', 'Kinh Dị'],
    releaseDate: new Date('2026-04-30'),
    posterImg:
      'https://api-website.cinestar.com.vn/media/wysiwyg/Posters/12-2025/dai-tiec-trang-mau.jpg',
    trailerLink: '',
    description:
      'Đại tiệc trăng máu 8 không chỉ là một bộ phim, đó là sự phơi bày tàn khốc những áp lực sau ống kính. Khi ở ranh giới giữa diễn xuất và bạo lực phim trường, liệu ai mới thực sự là nạn nhân trong cuộc chiến sinh tồn này?',
    status: 'now_showing',
  },
  {
    title: 'MORTAL KOMBAT: CUỘC CHIẾN SINH TỬ II',
    minutes: 99,
    genre: ['Thần Thoại', 'Phiêu Lưu', 'Hành Động'],
    releaseDate: new Date('2026-05-15'),
    posterImg:
      'https://api-website.cinestar.com.vn/media/wysiwyg/Posters/05-2025/MORTAL_KOMBAT_II-Teaser_Poster-700x1000_1_.jpg',
    trailerLink: 'https://youtu.be/OxFuEBUHJFU',
    description:
      'Hãng phim New Line Cinema, phần tiếp theo đầy kịch tính trong loạt phim bom tấn chuyển thể từ trò chơi điện tử đình đám – Mortal Kombat II – trở lại với tất cả sự tàn bạo vốn có. Lần này, những nhà vô địch được yêu thích – nay có sự góp mặt của chính Johnny Cage – sẽ đối đầu với nhau trong trận chiến đẫm máu, không khoan nhượng, nhằm đánh bại thế lực đen tối của Shao Kahn đang đe dọa đến sự tồn vong của Earthrealm và các chiến binh bảo vệ nó.',
    status: 'now_showing',
  },
  {
    title: 'NHÀ HAI CHỦ',
    minutes: 99,
    genre: ['Kinh Dị'],
    releaseDate: new Date('2025-12-05'),
    posterImg:
      'https://api-website.cinestar.com.vn/media/wysiwyg/Posters/12-2025/nha-hai-chu-payoff.jpg',
    trailerLink: 'https://youtu.be/oRxJOh8FrUA',
    description:
      'Một gia đình nhỏ vì không đủ điều kiện đã phải mua một căn nhà mà người dân xung quanh đồn đoán rằng có nhiều điều tâm linh kỳ lạ. Liệu họ sẽ đối mặt với ngôi nhà nhiều chủ sẽ như thế nào?',
    status: 'now_showing',
  },
  {
    title: 'CHÀNG MÈO MANG MŨ',
    minutes: 99,
    genre: ['Hoạt hình', 'Gia đình', 'Phiêu Lưu'],
    releaseDate: new Date('2026-11-06'),
    posterImg:
      'https://api-website.cinestar.com.vn/media/wysiwyg/Posters/11-2025/THE_CAT_IN_THE_HAT-Teaser_Poster-061126-700x1000.jpg',
    trailerLink: '',
    description:
      'Trong phim,Chàng Mèo Mang Mũ của chúng ta nhận nhiệm vụ khó khăn nhất từ trước đến nay từ tổ chức I.I.I.I. (Viện Sáng Tạo và Cảm Hứng, LLC): cổ vũ tinh thần cho Gabby và Sebastian, hai anh em đang vật lộn với việc thích nghi sau khi chuyển đến một thị trấn mới. Với "thành tích" thường xuyên làm quá mọi chuyện, lần này có thể sẽ là cơ hội cuối cùng để anh chàng chuyên gây rối này chứng minh bản thân nếu không muốn mất đi chiếc mũ thần kỳ!',
    status: 'now_showing',
  },
  {
    title: 'SPONGEBOB: LỜI NGUYỀN HẢI TẶC',
    minutes: 99,
    genre: ['Hoạt hình', 'Hài', 'Phiêu Lưu'],
    releaseDate: new Date('2025-12-26'),
    posterImg:
      'https://api-website.cinestar.com.vn/media/wysiwyg/Posters/12-2025/spongebob-poster.png',
    trailerLink: 'https://youtu.be/lRgJyuBu8IA',
    description:
      'SpongeBob phiêu lưu xuống đáy đại dương để đối mặt với hồn ma của Người Hà Lan bay, vượt qua thử thách và khám phá những bí ẩn dưới biển.',
    status: 'now_showing',
  },
  {
    title: 'THOÁT KHỎI TẬN THẾ',
    minutes: 99,
    genre: ['Phiêu Lưu', 'Khoa Học Viễn Tưởng'],
    releaseDate: new Date('2026-03-20'),
    posterImg:
      'https://api-website.cinestar.com.vn/media/wysiwyg/Posters/03-2026/thoat-khoi-tan-the.jpg',
    trailerLink: '',
    description:
      'Ryland Grace (Ryan Gosling) tỉnh dậy trong một con tàu vũ trụ mà không hề có bất kỳ ký ức gì. Anh dần khám phá ra mình là thành viên duy nhất còn sống sót của dự án Hail Mary - một sứ mệnh táo bạo đưa con tàu đến hệ mặt trời Tau Ceti để tìm cách cứu Trái đất khỏi ngày tận thế. Bất ngờ khi Grace đối mặt với một con tàu lạ và gặp gỡ sinh vật ngoài hành tinh mà anh đặt tên là Rocky.',
    status: 'now_showing',
  },
  {
    title: 'CÚ NHẢY KỲ DIỆU',
    minutes: 99,
    genre: ['Hoạt hình', 'Hài', 'Gia đình', 'Phiêu Lưu'],
    releaseDate: new Date('2026-03-27'),
    posterImg:
      'https://api-website.cinestar.com.vn/media/wysiwyg/Posters/03-2026/hoopers-poster.jpg',
    trailerLink: '',
    description:
      'Nó tưng tửng mà nó dễ thương thiệt sự luôn. Ai từng mê nét hài của ba anh gấu trong We Bare Bears thì chuẩn bị tinh thần nha, Hoppers là cả một… rừng thú tấu hài, từ cùng đạo diễn đứng sau loạt phim gấu đó. Hoppers (Cú Nhảy Kỳ Diệu) dự kiến ra rạp vào tháng 3 năm 2026',
    status: 'now_showing',
  },
  {
    title: 'THE ODYSSEY',
    minutes: 99,
    genre: ['Thần Thoại', 'Hành Động'],
    releaseDate: new Date('2026-07-17'),
    posterImg: 'https://api-website.cinestar.com.vn/media/wysiwyg/Posters/07-2026/the-odyssey.jpg',
    trailerLink: '',
    description:
      'The Odyssey lấy cảm hứng từ trường ca của Homer, ghi hình hoàn toàn bằng máy quay phim Imax, có kinh phí ước tính 250 triệu USD. Tác phẩm lấy cảm hứng từ thần thoại Hy Lạp, trong đó Matt Damon vào vai Odysseus, người anh hùng mất 10 năm trở về quê nhà sau cuộc chiến thành Troy. Nhân vật chạm trán với các vị thần, quái vật, trải qua nhiều thử thách để đoàn tụ vợ và giành lại vương quốc.',
    status: 'now_showing',
  },
  {
    title: 'HÀNH TRÌNH CỦA CHÚNG TA (T16)',
    minutes: 100,
    genre: ['Khác'],
    releaseDate: new Date('2025-12-14'),
    posterImg:
      'https://api-website.cinestar.com.vn/media/wysiwyg/Posters/LHPBALAN-2025/hanh-trinh-cua-chung-ta.jpg',
    trailerLink: '',
    description:
      'Một câu chuyện vừa hài hước, vừa cảm động về một gia đình hỗn loạn như cơn lốc. Mọi thứ bắt đầu dồn dập khi hai ông bà cao tuổi là Józiek và Ela quyết định khởi hành chuyến đi vòng quanh Ba Lan. Họ muốn tận hưởng chuyến đi theo cách riêng: cười thật nhiều, liều lĩnh và yêu như lúc thuở 20. Nhưng khi con trai kiên quyết không chịu để họ thực hiện chuyến đi này, hai ông bà đầy tinh nghịch đã lấy trộm chiếc xe huyền thoại Nysa. Một cuộc phiêu lưu đầy ắp tiếng cười, tình cảm và những khoảnh khắc bất ngờ.',
    status: 'now_showing',
  },
  {
    title: 'KULEJ - SAU ÁNH HÀO QUANG (T18)',
    minutes: 148,
    genre: ['Khác'],
    releaseDate: new Date('2025-12-13'),
    posterImg:
      'https://api-website.cinestar.com.vn/media/wysiwyg/Posters/LHPBALAN-2025/KULEJ-sau-anh-hao-quang.png',
    trailerLink: '',
    description:
      'Những tài năng piano trẻ xuất sắc nhất thế giới tụ hội tại Warsaw, Ba Lan, nơi Cuộc thi Piano Quốc tế Chopin, được tổ chức 5 năm một lần, quyết định khoảnh khắc lịch sử. “Khúc nhạc vinh quang” mở ra hậu trường hiếm có của hành trình khốc liệt ấy: khoảnh khắc thăng hoa rực rỡ, nỗi thất bại đau đớn, và những phút giây đối mặt với chính bản thân mình. Không chỉ là câu chuyện về âm nhạc, bộ phim là hành trình trưởng thành của những nghệ sĩ trẻ đứng giữa đam mê, áp lực và khát vọng vươn tới đỉnh cao',
    status: 'now_showing',
  },
  {
    title: 'NGỌN LỬA HỒI SINH (T13)',
    minutes: 94,
    genre: ['Khác'],
    releaseDate: new Date('2025-12-12'),
    posterImg:
      'https://api-website.cinestar.com.vn/media/wysiwyg/Posters/LHPBALAN-2025/ngon-lua-hoi-sinh.jpg',
    trailerLink: '',
    description:
      'Nastka, 20 tuổi, kể câu chuyện của chính mình từ sau ô cửa nhỏ, nơi cô nhìn thấy thế giới mà cơ thể bại não không cho phép chạm đến. Bên ngoài khung cửa ấy là cuộc sống của người cha tận tụy nhưng chưa một lần đối diện nỗi đau mất vợ, và người chị Łucja, vũ công ballet đầy tham vọng, sẵn sàng đánh đổi tất cả để tỏa sáng. Cho đến khi cú chấn thương nghiệt ngã buộc Łucja phải nhìn thẳng vào cuộc đời mình… và mọi sự ghen ghét đổ dồn hết vàp em gái. Sự thay đổi đến từ điều mà không ai ngờ tới: Józefina, người hàng xóm lập dị nhưng đầy ấm áp. Nhờ Józefina, Nastka vượt qua kỳ thi tốt nghiệp, Poldek học cách chữa lành quá khứ, và gia đình tìm lại tiếng nói chung sau những năm dài im lặng. Khi mọi vết thương dần lành lại, Łucja từ bỏ giấc mơ hào nhoáng trên sân khấu và chọn múa giữa đường phố, nơi cô thực sự được là chính mình. Đôi khi chỉ khi buông bỏ ước mơ cũ, ta mới chạm tới điều mình từng mong muốn.',
    status: 'now_showing',
  },
  {
    title: 'KHÚC NHẠC VINH QUANG (P)',
    minutes: 93,
    genre: ['Khác'],
    releaseDate: new Date('2025-12-14'),
    posterImg:
      'https://api-website.cinestar.com.vn/media/wysiwyg/Posters/LHPBALAN-2025/khuc-nhac-vinh-quang.jpg',
    trailerLink: '',
    description:
      'Những tài năng piano trẻ xuất sắc nhất thế giới tụ hội tại Warsaw, Ba Lan, nơi Cuộc thi Piano Quốc tế Chopin, được tổ chức 5 năm một lần, quyết định khoảnh khắc lịch sử. “Khúc nhạc vinh quang” mở ra hậu trường hiếm có của hành trình khốc liệt ấy: khoảnh khắc thăng hoa rực rỡ, nỗi thất bại đau đớn, và những phút giây đối mặt với chính bản thân mình. Không chỉ là câu chuyện về âm nhạc, bộ phim là hành trình trưởng thành của những nghệ sĩ trẻ đứng giữa đam mê, áp lực và khát vọng vươn tới đỉnh cao.',
    status: 'now_showing',
  },
  {
    title: 'CÂU CHUYỆN KINH DỊ (T18)',
    minutes: 105,
    genre: ['Khác'],
    releaseDate: new Date('2025-12-11'),
    posterImg:
      'https://api-website.cinestar.com.vn/media/wysiwyg/Posters/LHPBALAN-2025/cau-chuyuen-kinh-di.jpg',
    trailerLink: '',
    description:
      '“Câu chuyện kinh dị” là câu chuyện trưởng thành đồng thời là châm biếm sâu cay về thị trường việc làm hiện đại. Tomek, một sinh viên mới ra trường, quyết tâm giành lấy vị trí danh giá trong một tập đoàn để cưa cẩm lại cô bạn gái cũ. Trong khi tìm việc, anh chuyển vào một căn phòng giá rẻ, đậm chất “ngôi nhà ma ám”. Nhưng thời gian trôi qua, Tomek nhận ra nỗi kinh hoàng thật sự không nằm ở ngôi nhà hay những cư dân kỳ quái, mà chính là cuộc đua săn việc căng thẳng và tàn nhẫn ngoài kia. Đôi khi, nỗi sợ lớn nhất không phải những gì nhìn thấy, mà là những gì phải đối mặt trong đời thực.',
    status: 'now_showing',
  },
  {
    title: 'ENTROPIA (T16) / KẺ LẠC BẦY (T16)',
    minutes: 134,
    genre: ['Khác'],
    releaseDate: new Date('2025-12-10'),
    posterImg:
      'https://api-website.cinestar.com.vn/media/wysiwyg/Posters/LHPBALAN-2025/chum-phim-khai-mac.png',
    trailerLink: '',
    description:
      'Mây lựa chọn một hành động không thể quay đầu, từ đó tạo ra hỗn loạn lớn hơn thay vì giữ cân bằng cho thế giới của chính mình. Entropy không chỉ là cuộc va chạm văn hóa Ba Lan - Việt Nam, mà còn là hành trình bóc tách sự “nhiễu loạn xã hội”, nơi những câu hỏi nhức nhối buộc chúng ta phải đối diện và tự chịu trách nhiệm. Những mất mát vô hình, một khi đã xảy ra, sẽ không bao giờ có thể lấy lại được.',
    status: 'now_showing',
  },
];

module.exports = movies;
