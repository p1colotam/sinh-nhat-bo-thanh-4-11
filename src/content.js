const mediaUrl = path => `${import.meta.env.BASE_URL}${path}`;

const memoryCaptions = [
  'Lúc này là con còn bé xíu xíu nè, con cũng k biết là ai chụp luôn, nhưng đây là bức ảnh con nghĩ là đầu tiên trong những bức ảnh con được thấy mà con chụp với bố áa hihi. Hồi con up str ảnh này lên fb bố còn trloi lại là "Càng lớn nhìn càng ghét" =)))) Thế mà đã mấy năm trôi qua kể từ ngày ấy rùi ấ, con vẫn nhớ kbt liệu bố còn nhớ khummm',
  'Này là lúc gia đình mình đi chơi vs mọi người nèe, lúc này trông bố mẹ đều trẻ nhỉii, còn con thì cứ nhăn nhở thoi hihi',
  'Hồi nì chắc là đám cưới hay đám hỏi của ai nè, lúc đó con còn bé xíu à nên cũng khôm nhớ nựa, thế bố có nhớ khonggg',
  'Lúc này là cả nhà đi Yên Tử nèe, con nhớ là lúc đó bố cõng con leo lến đến đỉnh lun ý, chắc lúc đó con cũng hay mè nheo nữâaa, mà hôm đó đường chắc cũng k dễ đi đâu nhỉ, vậy mà bố cõng con trên được đoạn đường siêu dài ấyy, bố như siêu nhân ấy nhỉ hihi, siêu khỏe lun 💪💪💪🦸‍♂️🦸‍♂️🦸‍♂️',
  '=))))) Này là tấm của Tôm chụp hồi nhà mình về quê hay sao áaa, nó lấy máy của con chụp filter gì ấ trông bố buồn cười ghê hihi, trông cũm cute ấ hahahahaah 🤣🤣🤣',
  'Lúc này là cả nhà mình đi Quảng Bình nàyy, ảnh này mẹ còn nhờ con chỉnh ảnh cho màu ảnh đẹp hơn áa, còn nhờ con chỉnh bụng cho bố nữa hahahahaha đáng iu thật chứ',
  'Đây là lúc nhà mình cùng bà nội đi du lịch Hội An nèee, mãi mới có được 1 chuyến đi du lịch với bà nội á, mà hơi tiếc ảnh nì kco mẹ vì lúc đấy mẹ là người chụp ảnh này mà k nhờ dc ai chụp hộ cho huhu 🥲',
  'Đây òii con tìm được ảnh đủ cả nhà mình khi ở Hội An rùi nèe, ảnh này cả nhà đều đẹp hihihi',
  'Ảnh cả nhà di chụp kỉ yếu với con nèe, hôm đó con có hơi cáu kỉnh 1 chútt vì make up k ưng lắm nma nhà mình vẫn có ảnh đẹp với nhau nhỉ hihi, mà bâyh con đi du học xa nhà òi nên cũm khó có ảnh với nhau như hồi xưa nựa híc',
  'Hihi vì hnay là sinh nhật bố nên con ưu tiên cho hình kỉ yếu con chụp với bố nèe, 2 bố con đều đáng yêu nhỉ hihihi, nma ảnh này con kco cườii 😅😁',
  'Đây rùi con tìm dc ảnh con với bố đều cười ròi nè hahahahaahh, ảnh này đẹp đó, dễ thưn ×100 lần ảnh kia hí hí 🫣',
  'Lần đầu tiên cả nhà mình đi chuph photobooth nèee, con thấy dễ thương ơi là dễ thương á, hôm đấy lúc đầu bố cứ bảo k chụp, may là mẹ với con đều gọi bố vào chụp nên mới có những tấm ảnh siu đáng iu nnay đấy nhóo hihihi, ôi xem lại ảnh mà nhớ gia đình nhớ bố mẹ nhớ tôm nhớ việt nam quá huhuhu 🥹🥹🥺🥺',
  ...Array(4).fill('còn đây là những tấm ảnh riêngg con thấy cuti ấ hihihi, bố có thấy dễ thương giống như con hoggg 😚😙'),
];

export const birthday = {
  dadName: 'Nguyễn Chí Thanh',
  day: '04',
  month: '11',
  music: {
    title: 'Khúc Hát Mừng Sinh Nhật',
    artist: 'Phan Đinh Tùng',
    src: mediaUrl('media/khuc-hat-mung-sinh-nhat.m4a'),
  },
  memories: memoryCaptions.map((caption, index) => ({
    image: mediaUrl(`media/memories/${String(index + 1).padStart(2, '0')}.webp`),
    caption,
  })),
};
