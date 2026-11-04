import { useEffect, useRef, useState } from 'react';
import confetti from 'canvas-confetti';
import { birthday } from './content';
import { MemoryAlbum } from './MemoryAlbum';

function Star({ className = '' }) {
  return <svg className={className} viewBox="0 0 24 24" aria-hidden="true"><path d="m12 1.8 2.9 6.9 7.5.6-5.7 4.9 1.8 7.3-6.5-3.8-6.5 3.8 1.8-7.3-5.7-4.9 7.5-.6L12 1.8Z" fill="currentColor" /></svg>;
}

function Gift({ open = false }) {
  return <div className={`gift ${open ? 'gift--open' : ''}`} aria-hidden="true">
    <div className="gift__glow" />
    <div className="gift__lid"><span className="gift__lid-band" /><span className="gift__bow gift__bow--left" /><span className="gift__bow gift__bow--right" /><span className="gift__knot" /></div>
    <div className="gift__body"><span className="gift__body-band" /><span className="gift__medallion"><Star /></span></div>
    <div className="gift__shadow" />
  </div>;
}

function Cake({ blown, onBlow, compact = false }) {
  return <div className={`cake-wrap ${compact ? 'cake-wrap--compact' : ''}`}>
    <div className="cake-spark cake-spark--one">✦</div><div className="cake-spark cake-spark--two">✧</div><div className="cake-spark cake-spark--three">✦</div>
    <button type="button" className="cake-button" onClick={onBlow} aria-label={blown ? 'Nến đã được thổi tắt' : 'Chạm để thổi nến sinh nhật'} disabled={blown}>
      <svg className="cake-svg" viewBox="0 0 580 530" role="img" aria-label="Bánh sinh nhật màu xanh olive với ba ngọn nến">
        <defs>
          <linearGradient id="cakeTop" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#f8d8c8"/><stop offset="1" stopColor="#e9b6ae"/></linearGradient>
          <linearGradient id="cakeSide" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#8ca080"/><stop offset="1" stopColor="#52694c"/></linearGradient>
          <filter id="cakeShadow"><feDropShadow dx="0" dy="20" stdDeviation="18" floodColor="#4a5639" floodOpacity=".22"/></filter>
        </defs>
        <ellipse cx="290" cy="478" rx="231" ry="30" fill="#d9c7a4" opacity=".48" />
        <ellipse cx="290" cy="455" rx="235" ry="34" fill="#f8f1e3" stroke="#dbbd81" strokeWidth="8" />
        <ellipse cx="290" cy="453" rx="204" ry="23" fill="#e4d2aa" />
        <g filter="url(#cakeShadow)">
          <path d="M115 278h350v155c0 31-78 50-175 50s-175-19-175-50V278Z" fill="url(#cakeSide)" />
          <ellipse cx="290" cy="281" rx="175" ry="48" fill="#a4b093" />
          <path d="M115 274c0-31 78-53 175-53s175 22 175 53v38c-14-8-22-6-22 12 0 17-12 24-24 10-12-13-26-7-26 12 0 22-15 27-29 11-13-14-29-8-29 11 0 26-18 29-31 10-13-20-33-12-33 12 0 23-18 28-31 9-13-19-31-12-31 11 0 20-16 27-30 10-13-16-30-8-30 10 0 17-18 23-28 7-11-17-24-18-36-8v-45Z" fill="#fff3e0" />
          <ellipse cx="290" cy="273" rx="175" ry="48" fill="#fff6e7" />
          <ellipse cx="290" cy="269" rx="148" ry="34" fill="url(#cakeTop)" />
          <path d="M146 269c22-15 69-26 144-26s122 11 144 26" fill="none" stroke="#fff6e7" strokeWidth="9" strokeLinecap="round" />
          <path d="M155 382c36 11 79 16 135 16s103-5 135-16" stroke="#efc8b7" strokeWidth="7" fill="none" strokeLinecap="round" strokeDasharray="2 20" />
          <path d="M177 422c36 10 73 15 113 15s77-5 113-15" stroke="#d5ad67" strokeWidth="6" fill="none" strokeLinecap="round" strokeDasharray="2 18" />
        </g>
        {[245, 290, 335].map((x, i) => <g key={x}>
          <rect x={x - 8} y={170 - (i === 1 ? 15 : 0)} width="16" height="64" rx="6" fill={i === 1 ? '#d3ab64' : '#708665'} stroke="#fff3dc" strokeWidth="3" />
          <path d={`M${x} ${170 - (i === 1 ? 15 : 0)}v-9`} stroke="#586144" strokeWidth="3" />
          {!blown && <g className="flame"><ellipse cx={x} cy={143 - (i === 1 ? 15 : 0)} rx="11" ry="18" fill="#ffc65a"/><ellipse cx={x} cy={149 - (i === 1 ? 15 : 0)} rx="5" ry="9" fill="#fff4bd" /></g>}
          {blown && <path className="smoke" d={`M${x} ${151 - (i === 1 ? 15 : 0)}q-13-16 2-29t-1-22`} stroke="#a9aba2" strokeWidth="4" fill="none" strokeLinecap="round" />}
        </g>)}
        <g fill="#d6aa62"><path d="m91 203 5 13 13 5-13 5-5 13-5-13-13-5 13-5Z"/><path d="m482 189 4 10 10 4-10 4-4 10-4-10-10-4 10-4Z"/></g>
        <g fill="#eebeb7"><circle cx="139" cy="191" r="6"/><circle cx="451" cy="233" r="6"/></g>
      </svg>
    </button>
  </div>;
}

function App() {
  const [stage, setStage] = useState('wrapped');
  const [blown, setBlown] = useState(false);
  const [modal, setModal] = useState(null);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [musicError, setMusicError] = useState(false);
  const timers = useRef([]);
  const modalCloseRef = useRef(null);
  const musicRef = useRef(null);

  const clearTimers = () => { timers.current.forEach(clearTimeout); timers.current = []; };
  const startMusic = () => {
    const audio = musicRef.current;
    if (!audio || musicError) return;
    audio.volume = 0.45;
    audio.play().catch(() => setMusicPlaying(false));
  };
  const toggleMusic = () => {
    if (musicRef.current?.paused) startMusic();
    else musicRef.current?.pause();
  };
  const celebrate = () => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    confetti({ particleCount: 95, spread: 85, origin: { y: .62 }, colors: ['#d5ad67', '#e9bdba', '#748568', '#fff2d8'] });
    timers.current.push(setTimeout(() => confetti({ particleCount: 45, spread: 110, origin: { x: .15, y: .48 }, colors: ['#d5ad67', '#e9bdba', '#748568'] }), 350));
  };
  const openGift = () => {
    startMusic();
    clearTimers();
    setBlown(false);
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setStage('revealed'); return; }
    setStage('opening');
    timers.current.push(setTimeout(celebrate, 450));
    timers.current.push(setTimeout(() => setStage('rising'), 1450));
    timers.current.push(setTimeout(() => setStage('revealed'), 4050));
  };
  const replay = () => { clearTimers(); setModal(null); setBlown(false); setStage('wrapped'); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const blowCandles = () => { if (blown) return; setBlown(true); if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) confetti({ particleCount: 32, spread: 60, origin: { x: .73, y: .42 }, colors: ['#d5ad67', '#f0c7c6'] }); };
  const closeModal = () => { setModal(null); modalCloseRef.current?.focus?.(); };
  const openModal = type => { modalCloseRef.current = document.activeElement; setModal(type); };

  useEffect(() => () => clearTimers(), []);
  useEffect(() => {
    if (birthday.music.src) startMusic();
  }, []);
  useEffect(() => {
    if (!modal) return;
    const onKey = event => { if (event.key === 'Escape') closeModal(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [modal]);

  return <div className={`site site--${stage}`}>
    <div className="ambient ambient--one"/><div className="ambient ambient--two"/>
    <header className="topbar">
      <a className="brand" href="#top" aria-label="Về đầu trang"><span className="brand__mark"><Star /></span><span>CHIẾN DỊCH <strong>04.11</strong></span></a>
      {birthday.music.src ? <button type="button" className={`music-button ${musicPlaying ? 'music-button--playing' : ''}`} onClick={toggleMusic} disabled={musicError} aria-label={`${musicPlaying ? 'Tắt' : 'Bật'} nhạc nền: ${birthday.music.title} — ${birthday.music.artist}`} aria-pressed={musicPlaying}>
        <span className="music-button__icon" aria-hidden="true">♫</span>
        <span className="music-button__details"><strong>{birthday.music.title}</strong><small>{musicError ? 'Không phát được nhạc' : `${birthday.music.artist} · ${musicPlaying ? 'Đang phát' : 'Bật nhạc'}`}</small></span>
      </button> : <span className="topbar__right"><span className="topbar__dot"/> Món quà dành riêng cho bố Thanh</span>}
    </header>
    {birthday.music.src && <audio ref={musicRef} src={birthday.music.src} preload="auto" loop onPlay={() => setMusicPlaying(true)} onPause={() => setMusicPlaying(false)} onError={() => { setMusicError(true); setMusicPlaying(false); }} onCanPlay={() => setMusicError(false)} />}

    {stage !== 'revealed' ? <main id="top" className="intro">
      <h1>Có một <em>nhiệm vụ đặc biệt</em><br/>dành riêng cho bố!</h1>
      <p className="intro__subtitle">Đố bố biết trong hộp quà này là gì áaa 😙</p>
      <div className="intro__scene">
        <span className="scene-star scene-star--one">✦</span><span className="scene-star scene-star--two">✧</span><span className="scene-star scene-star--three">✦</span>
        <Gift open={stage !== 'wrapped'} />
        {(stage === 'rising' || stage === 'opening') && <div className={`emerging-cake ${stage === 'rising' ? 'emerging-cake--up' : ''}`}><Cake blown={false} onBlow={() => {}} compact /></div>}
      </div>
      {stage === 'wrapped' ? <button className="primary-button" onClick={openGift}><Star /> Mở quà thui nào 🎁 <span aria-hidden="true">↗</span></button> : <div className="intro__loading"><span>Điều bất ngờ đang mở ra...</span><button onClick={() => { clearTimers(); setStage('revealed'); }}>Bỏ qua hiệu ứng</button></div>}
      <p className="intro__footnote">Được chuẩn bị bằng tất cả yêu thương của con <span>♥</span></p>
    </main> : <main id="top" className="revealed">
      <div className="mission-banner"><span><Star /> NHIỆM VỤ 04.11</span><span>Dành riêng cho bố Nguyễn Chí Thanh</span><span className="mission-banner__seal">TOP SECRET ♥</span></div>
      <section className="celebration" aria-labelledby="birthday-heading">
        <div className="celebration__copy">
          <span className="eyebrow"><span className="eyebrow__dash"/> GỬI ĐẾN NGƯỜI BỐ TUYỆT VỜI NHẤT</span>
          <h1 id="birthday-heading">Chúc mừng<br/><em>sinh nhật bố!</em></h1>
          <p className="celebration__name">Nguyễn Chí Thanh <span>✦</span> 04.11</p>
          <div className="wish">
            <div className="wish__heading"><span>✦ &nbsp; LỜI CHÚC TỪ TRÁI TIM</span><span>04 · 11</span></div>
            <p className="wish__salutation">Gửi bố Thanh 👨</p>
            <p className="wish__body">Con gái iu có đôi lời muốn gửi đến bố nhân ngày sinh nhật ạ 🎂🎉 Đầu tiên thì con muốn gửi lời chúc mừng sinh nhật đến bố. trước hihi 🎊 Vậy là thêm một tuổi mới của bố lại đến, nhưng năm nay con không thể ở nhà để trực tiếp chúc mừng và cùng bố đón sinh nhật như mọi năm òi huhu. Ước gì con đang ở Việt Nam thì nhà mình lại được 1 bữa lẩu hay vịt nướng để chúc mừng bố nhỉ hhahaha</p>
            <p>Ở một nơi xa thật xa, con chỉ mong bố của con luôn thật nhiều sức khỏe, bình an và vui vẻ. Mong bố luôn giữ được tinh thần lạc quan, mạnh mẽ, nhưng cũng đừng quên chăm sóc bản thân và dành thời gian nghỉ ngơi cho mình bố nhé. Bố đã dành rất nhiều năm để cống hiến cho công việc, cho gia đình, nên con mong những năm tháng tiếp theo bố sẽ có thật nhiều niềm vui và những ngày tháng thật an yên.</p>
            <p>Con biết đôi khi mình không giỏi thể hiện tình cảm bằng lời nói, nhưng con luôn biết ơn và tự hào về bố. Cảm ơn bố vì đã luôn là chỗ dựa vững chắc cho gia đình, và cũng là người âm thầm dành cho chúng con những điều tốt đẹp nhất.</p>
            <p>Con sẽ cố gắng học tập thật tốt, sống thật tốt và trưởng thành hơn mỗi ngày để bố mẹ yên tâm. Dù hiện tại con đang ở cách nhà hàng nghìn cây số, giữa một đất nước xa lạ với bao điều mới mẻ, con vẫn luôn nhớ nhà và nhớ bố mẹ rất nhiều.</p>
            <p>Chúc bố tuổi mới thật nhiều sức khỏe, luôn vững vàng, bình an và hạnh phúc. Con gái yêu bố nhiều lắm. Mong sớm được về nhà, ôm bố một cái thật lâu!</p>
            <p className="wish__signature">Happy Birthday, bố của con! ❤️</p>
          </div>
          <p className="russian">С днём рождения, папа! <span>✦</span></p>
        </div>
        <div className="celebration__visual">
          <div className="cake-halo"/><Cake blown={blown} onBlow={blowCandles} />
          <div className="cake-note">{blown ? '✦ Điều ước của bố sẽ thành hiện thực! ✦' : '✦ Chạm vào nến để gửi một điều ước ✦'}</div>
          <div className="round-stamp"><Star /><span>MADE WITH LOVE<br/>FOR DAD</span></div>
        </div>
      </section>

      <section className="memory-section" aria-labelledby="memory-heading">
        <div className="section-heading"><span className="eyebrow">✦ MIỀN KÝ ỨC ✦</span><h2 id="memory-heading">Liệu bố còn nhớ<br/><em>khôngg 🖼</em></h2><p>Mỗi kỷ niệm bên bố đều là một món quà con luôn trân trọng.</p></div>
        <MemoryAlbum memories={birthday.memories} />
      </section>

      <section className="letter-section"><div className="letter-section__ornament">✦</div><div><span className="eyebrow">Một lá thư, ngàn lời yêu thương</span><h2>Đôi lời gửi bố <br/><em>từ Moscow <span className="russia-flag" role="img" aria-label="Quốc kỳ Nga">🇷🇺</span></em></h2><p>Một chút yêu thương từ cô con gái đang ở nơi xa, gửi về người luôn là điểm tựa của con.</p></div><button className="outline-button" onClick={() => openModal('letter')}>Đọc thư 🎀💌</button></section>
      <div className="mission-complete"><Star /><span>NHIỆM VỤ HOÀN THÀNH</span><strong>Bố đã nhận được thật nhiều yêu thương!</strong><span>♥</span></div>
      <footer><span>✦ Made with love, for Dad ✦</span><button onClick={replay}>Mở lại món quà ↺</button></footer>
    </main>}

    {modal && <div className="modal-backdrop" onMouseDown={event => { if (event.target === event.currentTarget) closeModal(); }}><div className={`modal ${modal === 'letter' ? 'modal--letter' : ''}`} role="dialog" aria-modal="true" aria-labelledby="modal-title"><button className="modal__close" onClick={closeModal} aria-label="Đóng cửa sổ">×</button>
      {modal === 'letter' && <div className="letter-frame"><span className="eyebrow">✦ LÁ THƯ TỪ MOSCOW ✦</span><h2 id="modal-title">Gửi bố, từ Moscow thân thương💗</h2><div className="letter-body">
        <p>Bố à,</p>
        <p>Không biết ở nhà hôm nay bố đang làm gì nhỉ? Còn ở Moscow, con đang ngồi viết những dòng này, ngoài cửa sổ có lẽ trời lại lạnh thêm một chút. Thành phố này rộng lớn, có rất nhiều điều mới mẻ để khám phá, nhưng đôi khi giữa những con phố xa lạ, con vẫn bất chợt nhớ về căn nhà nhỏ của mình, nhớ những bữa cơm gia đình và nhớ cả những điều bình dị mà trước đây con vốn nghĩ là hiển nhiên.</p>
        <p>Ngày trước, con luôn nghĩ rằng đi xa đơn giản là được đến một nơi mới, học hỏi những điều mới và tự mình trải nghiệm cuộc sống. Nhưng đến khi thực sự sống cách nhà hàng nghìn cây số, con mới hiểu rằng phía sau mỗi chuyến đi luôn có một nơi để trở về, và phía sau sự trưởng thành của con luôn có bóng dáng của bố mẹ.</p>
        <p>Có những lúc gặp khó khăn, có những ngày mọi thứ không diễn ra như mong muốn, con lại nghĩ đến gia đình. Nghĩ đến bố, đến sự mạnh mẽ, kiên trì và cách bố luôn cố gắng lo toan cho mọi người. Có lẽ chính những điều ấy đã trở thành một phần hành trang để con tự tin hơn khi bước ra thế giới rộng lớn ngoài kia.</p>
        <p>Con cũng nhận ra rằng mình vẫn còn rất nhiều điều phải học, phải trải nghiệm và phải cố gắng. Con muốn được trưởng thành hơn, độc lập hơn, biết quan tâm đến mọi người nhiều hơn và trở thành một người mà bố mẹ có thể tự hào. Dù đôi khi con vẫn còn trẻ con, đôi khi còn vụng về và chưa biết cách thể hiện tình cảm, nhưng con luôn trân trọng tất cả những gì bố đã dành cho gia đình mình.</p>
        <p>Bố biết không, Moscow có thể cho con rất nhiều trải nghiệm mới, nhưng chẳng nơi nào có thể thay thế cảm giác được trở về nhà. Con vẫn mong đến một ngày được kể cho bố nghe thật nhiều câu chuyện về nước Nga, về những nơi con đã đi qua, những người con đã gặp và cả những điều thú vị mà con học được. Mong rằng khi ấy, bố vẫn sẽ ngồi nghe cô con gái nhỏ líu lo kể chuyện như mọi khi.</p>
        <p>Cuối cùng, con chỉ muốn nói rằng: bố hãy cứ yên tâm về con nhé! Con sẽ cố gắng chăm sóc bản thân, học tập thật tốt và sống thật vui trên hành trình của mình. Còn bố cũng nhớ dành thời gian cho bản thân, cho những sở thích riêng và cho những niềm vui nhỏ mỗi ngày nữa nhé. Con mong bố luôn khỏe mạnh để sau này bố con mình còn có thật nhiều chuyến đi, thật nhiều bữa ăn ngon và thật nhiều câu chuyện để kể cho nhau nghe.</p>
        <p>Từ Moscow xa xôi, gửi về bố một chiếc ôm thật lớn và thật nhiều thương nhớ.</p>
      </div><div className="letter-signature"><strong>Con gái Phương Khánh của bố ❤️</strong></div><button className="letter-close" onClick={closeModal}>Đóng thư</button></div>}
    </div></div>}
  </div>;
}

export default App;
