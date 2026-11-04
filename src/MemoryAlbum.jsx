import { forwardRef, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import HTMLFlipBook from 'react-pageflip';

const pad = number => String(number).padStart(2, '0');

const getTurnCorner = event => {
  const touch = event.touches?.[0];
  const sheet = event.target.closest?.('.flip-album__sheet');
  if (!touch || !sheet) return null;
  const rect = sheet.getBoundingClientRect();
  const x = touch.clientX - rect.left;
  const y = touch.clientY - rect.top;
  const edge = Math.min(64, rect.width * .23);
  const cornerHeight = Math.min(82, rect.height * .2);
  if (y > cornerHeight && y < rect.height - cornerHeight) return null;
  const side = x <= edge ? 'left' : x >= rect.width - edge ? 'right' : null;
  return side ? { side, corner: y < rect.height / 2 ? 'top' : 'bottom', width: rect.width } : null;
};

const CoverPage = forwardRef(function CoverPage({ back = false }, ref) {
  return <div ref={ref} className={`flip-album__sheet flip-album__sheet--cover ${back ? 'flip-album__sheet--back-cover' : ''}`} data-density="hard">
    <div className="flip-album__cover-frame">
      <span className="flip-album__cover-date">✦ &nbsp; 04 · 11 &nbsp; ✦</span>
      <span className="flip-album__cover-flourish" aria-hidden="true">❦</span>
      <strong>{back ? <>Thương bố<br />thật nhiều</> : <>Miền<br />Ký Ức</>}</strong>
      <span className="flip-album__cover-rule" />
      <span className="flip-album__cover-subtitle">{back ? 'Những kỷ niệm sẽ luôn ở đây ♡' : 'Cuốn album dành cho bố Thanh'}</span>
      <span className="flip-album__cover-hint">{back ? 'Lật lại để xem từ đầu' : 'Lật bìa để bắt đầu'} <span aria-hidden="true">↗</span></span>
    </div>
  </div>;
});

const MemoryPage = forwardRef(function MemoryPage({ memory, number, total, onOpenImage }, ref) {
  const captionSize = memory.caption.length <= 125 ? 'short' : memory.caption.length <= 170 ? 'medium' : 'long';
  return <div ref={ref} className="flip-album__sheet flip-album__sheet--memory" data-page-number={number}>
    <div className="flip-album__page-layout">
      <div className="flip-album__page-top"><span>✦ MIỀN KÝ ỨC ✦</span><span>{pad(number)} / {pad(total)}</span></div>
      <div className="flip-album__memory">
        <button className="flip-album__photo-button" type="button" onMouseDownCapture={event => event.stopPropagation()} onTouchStartCapture={event => { if (!getTurnCorner(event)) event.stopPropagation(); }} onClick={event => { event.stopPropagation(); onOpenImage(number - 1); }} aria-label={`Phóng to ảnh kỷ niệm ${number}`}>
          <img
            className="flip-album__photo"
            src={number <= 2 ? memory.image : undefined}
            data-src={memory.image}
            data-page={number}
            alt={`Ảnh kỷ niệm ${number} cùng bố và gia đình`}
            decoding="async"
          />
          <span>Chạm ảnh để xem rõ hơn <span aria-hidden="true">↗</span></span>
        </button>
        <div className={`flip-album__caption flip-album__caption--${captionSize}`} role="region" tabIndex={0} aria-label={`Lời kể ảnh ${number}, cuộn để đọc hết`} onMouseDownCapture={event => event.stopPropagation()} onTouchStartCapture={event => { if (!getTurnCorner(event)) event.stopPropagation(); }}>
          <p>{memory.caption}</p>
        </div>
      </div>
      <div className="flip-album__page-bottom"><span>Giữ lại những điều đáng yêu</span><span>♡</span></div>
    </div>
  </div>;
});

export function MemoryAlbum({ memories }) {
  const bookRef = useRef(null);
  const imageFocusRef = useRef(null);
  const cornerTouchRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [orientation, setOrientation] = useState(() => window.innerWidth <= 700 ? 'portrait' : 'landscape');
  const [ready, setReady] = useState(false);
  const [turning, setTurning] = useState(false);
  const [zoomedImage, setZoomedImage] = useState(null);
  const [reducedMotion, setReducedMotion] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(query.matches);
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (!ready) return;
    const first = currentPage === 0 ? 1 : Math.max(1, currentPage - 2);
    const last = Math.min(memories.length, currentPage + (orientation === 'landscape' ? 3 : 2));
    document.querySelectorAll('.flip-album__photo[data-src]').forEach(image => {
      const page = Number(image.dataset.page);
      if (page >= first && page <= last && !image.getAttribute('src')) image.src = image.dataset.src;
    });
  }, [currentPage, orientation, ready, memories.length]);

  useEffect(() => {
    if (zoomedImage === null) return undefined;
    const onKey = event => { if (event.key === 'Escape') setZoomedImage(null); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; imageFocusRef.current?.focus?.(); };
  }, [zoomedImage]);

  const openImage = useCallback(index => {
    imageFocusRef.current = document.activeElement;
    setZoomedImage(index);
  }, []);

  const pages = useMemo(() => [
    <CoverPage key="cover" />,
    ...memories.map((memory, index) => <MemoryPage key={memory.image} memory={memory} number={index + 1} total={memories.length} onOpenImage={openImage} />),
    <CoverPage key="back-cover" back />,
  ], [memories, openImage]);

  const flip = direction => {
    const book = bookRef.current?.pageFlip();
    if (!book || turning || zoomedImage !== null) return;
    if (reducedMotion) {
      if (direction === 'next') book.turnToNextPage();
      else book.turnToPrevPage();
    } else if (direction === 'next') book.flipNext();
    else book.flipPrev();
  };

  const handleKeyDown = event => {
    if (event.key === 'ArrowRight') { event.preventDefault(); flip('next'); }
    if (event.key === 'ArrowLeft') { event.preventDefault(); flip('previous'); }
  };

  const handleTouchStartCapture = event => {
    cornerTouchRef.current = null;
    if (orientation !== 'portrait' || zoomedImage !== null || event.touches.length !== 1) return;
    const corner = getTurnCorner(event);
    if (corner) cornerTouchRef.current = { ...corner, x: event.touches[0].clientX, y: event.touches[0].clientY, startedAt: performance.now() };
  };

  const handleTouchEndCapture = event => {
    const gesture = cornerTouchRef.current;
    cornerTouchRef.current = null;
    if (!gesture || !event.changedTouches.length || zoomedImage !== null) return;
    const touch = event.changedTouches[0];
    const dx = touch.clientX - gesture.x;
    const dy = touch.clientY - gesture.y;
    const book = bookRef.current?.pageFlip();
    if (!book) return;
    if (Math.abs(dy) > 24 && Math.abs(dy) > Math.abs(dx)) {
      event.stopPropagation();
      book.userStop({ x: 0, y: 0 }, true);
      return;
    }
    const distance = Math.max(70, gesture.width * .25);
    if (performance.now() - gesture.startedAt < 250 || Math.abs(dx) < distance || Math.abs(dx) < Math.abs(dy) * 1.3) return;
    const direction = gesture.side === 'right' && dx < 0 ? 'next' : gesture.side === 'left' && dx > 0 ? 'previous' : null;
    if (!direction || direction === 'next' && currentPage >= memories.length + 1 || direction === 'previous' && currentPage === 0) return;
    event.stopPropagation();
    if (event.cancelable) event.preventDefault();
    book.userStop({ x: 0, y: 0 }, true);
    if (direction === 'next') book.flipNext(gesture.corner);
    else book.flipPrev(gesture.corner);
  };

  const lastPage = memories.length + 1;
  const isCover = currentPage === 0;
  const isBackCover = currentPage >= lastPage;
  const shownEnd = Math.min(memories.length, currentPage + (orientation === 'landscape' ? 1 : 0));
  const status = isCover ? 'BÌA' : isBackCover ? 'HẾT' : orientation === 'landscape' && shownEnd > currentPage ? `${pad(currentPage)}–${pad(shownEnd)}` : pad(currentPage);

  return <div className="flip-album" onKeyDown={handleKeyDown} onTouchStartCapture={handleTouchStartCapture} onTouchEndCapture={handleTouchEndCapture} onTouchCancelCapture={() => { cornerTouchRef.current = null; }}>
    <div className="flip-album__stage" aria-label="Album kỷ niệm có thể lật trang">
      <HTMLFlipBook
        ref={bookRef}
        className="flip-album__book"
        width={400}
        height={550}
        size="stretch"
        minWidth={260}
        maxWidth={420}
        minHeight={358}
        maxHeight={578}
        showCover
        usePortrait
        drawShadow={!reducedMotion}
        flippingTime={reducedMotion ? 1 : 850}
        maxShadowOpacity={0.38}
        mobileScrollSupport
        swipeDistance={35}
        clickEventForward
        useMouseEvents
        showPageCorners={!reducedMotion}
        renderOnlyPageLengthChange
        onInit={event => { setReady(true); setCurrentPage(event.data.page); setOrientation(event.data.mode); }}
        onFlip={event => setCurrentPage(event.data)}
        onChangeOrientation={event => setOrientation(event.data)}
        onChangeState={event => setTurning(event.data === 'flipping' || event.data === 'user_fold')}
      >{pages}</HTMLFlipBook>
    </div>
    <div className="flip-album__controls">
      <button type="button" onClick={() => flip('previous')} disabled={!ready || isCover || turning} aria-label="Lật về trang trước"><span aria-hidden="true">←</span><span>Trang trước</span></button>
      <div className="flip-album__status" aria-live="polite" aria-label={isCover ? 'Bìa album' : isBackCover ? 'Bìa sau album' : `Đang xem ảnh ${status} trên ${memories.length}`}><strong>{status}</strong>{!isCover && !isBackCover && <span> / {pad(memories.length)}</span>}<div className="flip-album__progress"><span style={{ width: `${(Math.min(currentPage, memories.length) / memories.length) * 100}%` }} /></div></div>
      <button type="button" onClick={() => flip('next')} disabled={!ready || isBackCover || turning} aria-label={isCover ? 'Lật bìa để xem ảnh đầu tiên' : 'Lật sang trang tiếp theo'}><span>{isCover ? 'Mở album' : 'Trang tiếp'}</span><span aria-hidden="true">→</span></button>
    </div>
    <p className="flip-album__hint">{isCover ? 'Chạm bìa hoặc nút Mở album để bắt đầu' : 'Chạm góc, giữ và vuốt ngang để lật · Cuộn lời kể nếu cần · Chạm ảnh để xem rõ hơn'}</p>

    {zoomedImage !== null && <div className="flip-album__backdrop" onMouseDown={event => { if (event.target === event.currentTarget) setZoomedImage(null); }}>
      <div className="flip-album__dialog flip-album__dialog--image" role="dialog" aria-modal="true" aria-labelledby="album-image-title" tabIndex={-1}>
        <button type="button" className="flip-album__dialog-close" onClick={() => setZoomedImage(null)} aria-label="Đóng ảnh">×</button>
        <h3 id="album-image-title">Ảnh kỷ niệm {pad(zoomedImage + 1)} / {pad(memories.length)}</h3>
        <img src={memories[zoomedImage].image} alt={`Ảnh kỷ niệm ${zoomedImage + 1} cùng bố và gia đình`} />
      </div>
    </div>}
  </div>;
}
