document.addEventListener('DOMContentLoaded', () => {
    // Helpers
    const $ = id => document.getElementById(id);
    const setText = (id, val) => { const el = $(id); if (el) el.textContent = val; };

    // 1. Dark Mode
    const dmToggle = $('darkModeToggle');
    if (dmToggle) {
        const setTheme = (isDark) => {
            document.body.classList.toggle('dark-mode', isDark);
            dmToggle.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        };
        setTheme(localStorage.getItem('theme') === 'dark');
        dmToggle.addEventListener('click', () => {
            const isDark = document.body.classList.toggle('dark-mode');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            dmToggle.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        });
    }

    // 2. Top Button
    const topBtn = $('topBtn');
    if (topBtn) {
        const updateTop = () => topBtn.classList.toggle('show', scrollY > 350);
        addEventListener('scroll', updateTop, { passive: true });
        updateTop();
        topBtn.onclick = () => scrollTo({ top: 0, behavior: 'smooth' });
    }

    // 3. Slider
    const featured = $('featured');
    if (featured) {
        const scroll = (dir) => {
            const gap = 24;
            const w = featured.firstElementChild.offsetWidth + gap;
            featured.scrollBy({ left: dir * w, behavior: 'smooth' });
        };
        $('next')?.addEventListener('click', () => scroll(-1));
        $('prev')?.addEventListener('click', () => scroll(1));
        if ($('dots')) $('dots').style.display = 'none';
    }

    // 4. Filter & LocalStorage
    const grid = $('eventsGrid');
    if (grid) {
        const items = [...grid.querySelectorAll('.event-item')], q = $('q'), cat = $('cat'), date = $('date'), loc = $('loc'), count = $('count'), empty = $('empty');
        const savedCat = localStorage.getItem('savedCategory');
        const urlCat = new URLSearchParams(location.search).get('category');
        
        if (urlCat && cat.querySelector(`option[value="${urlCat}"]`)) {
            cat.value = urlCat; localStorage.setItem('savedCategory', urlCat);
        } else if (savedCat && cat.querySelector(`option[value="${savedCat}"]`)) {
            cat.value = savedCat;
        }

        const filter = () => {
            let n = 0;
            items.forEach(el => {
                const text = (el.dataset.title + ' ' + el.dataset.search + ' ' + el.textContent).toLocaleLowerCase('ar');
                const ok = (!q.value || text.includes(q.value.toLocaleLowerCase('ar').trim())) && 
                           (!cat.value || el.dataset.category === cat.value) && 
                           (!date.value || el.dataset.date.startsWith(date.value)) && 
                           (!loc.value || el.dataset.location === loc.value);
                el.classList.toggle('d-none', !ok);
                if (ok) n++;
            });
            count.textContent = `عدد الفعاليات المطابقة: ${n}`;
            empty.classList.toggle('d-none', n !== 0);
            cat.value ? localStorage.setItem('savedCategory', cat.value) : localStorage.removeItem('savedCategory');
        };

        [q, cat, date, loc].forEach(x => ['input', 'change'].forEach(e => x.addEventListener(e, filter)));
        $('search')?.addEventListener('click', filter);
        $('reset')?.addEventListener('click', () => { q.value = cat.value = date.value = loc.value = ''; filter(); });
        filter();
    }

    // 5. Data
    const data = {
        '1': ['ورشة المهارات الرقمية', 'culture', 'ثقافة ومعرفة', '2024-10-24', '24 تشرين الأول 2024', '11:00 صباحاً', 'دمشق / عبر الإنترنت', 'اكتشف أدوات العصر الرقمي واصنع مستقبلك التقني من خلال خطوات عملية وتطبيقات مباشرة.', 'assets/img/culture-1.jpg', ['التعرف إلى أفكار وأدوات قابلة للتطبيق.', 'تبادل الخبرات مع زملاء من اهتمامات مختلفة.', 'مساحة للنقاش وطرح الأسئلة.'], ['assets/img/culture-2.jpg', 'assets/img/culture-3.jpg']],
        '2': ['لقاء المجتمع الطلابي', 'social', 'مجتمع وطلاب', '2024-11-02', '02 تشرين الثاني 2024', '04:00 مساءً', 'دمشق', 'مساحتك للتواصل، بناء الصداقات، وإطلاق المبادرات التي تجمع شمل الطلاب.', 'assets/img/social-1.jpg', ['بناء صداقات جديدة.', 'التعرف على الأنشطة الطلابية.', 'فرصة للمشاركة في المبادرات.'], ['assets/img/social-2.jpg', 'assets/img/social-3.jpg']],
        '3': ['أمسية موسيقية شبابية', 'music', 'فن وموسيقى', '2024-11-08', '08 تشرين الثاني 2024', '06:30 مساءً', 'حمص', 'لحظات موسيقية استثنائية تحتفي بمواهبكم الشابة والإبداع في جو مفعم بالحيوية.', 'assets/img/music-1.jpg', ['الاستمتاع بعروض موسيقية.', 'دعم المواهب الشابة.', 'قضاء وقت ممتع.'], ['assets/img/music-2.jpg', 'assets/img/music-3.jpg']],
        '4': ['جلسة حوار حول الابتكار', 'culture', 'ثقافة ومعرفة', '2024-11-15', '15 تشرين الثاني 2024', '12:00 ظهراً', 'اللاذقية', 'نقاشات ملهمة لصياغة أفكار تحدث فرقاً حقيقياً وتشجع على التفكير خارج الصندوق.', 'assets/img/culture-2.jpg', ['تعلم طرق التفكير الإبداعي.', 'مناقشة تحديات واقعية.'], ['assets/img/culture-1.jpg', 'assets/img/about-1.jpg']],
        '5': ['يوم النشاط الرياضي', 'sport', 'رياضة ونشاط', '2024-11-20', '20 تشرين الثاني 2024', '10:00 صباحاً', 'حلب', 'تحديات رياضية وطاقة إيجابية تنبض بروح الفريق، في يوم مليء بالحركة والمنافسة الشريفة.', 'assets/img/sport-1.jpg', ['تحسين اللياقة البدنية.', 'تعزيز روح الفريق.', 'المشاركة في مسابقات ممتعة.'], ['assets/img/sport-2.jpg', 'assets/img/sport-3.jpg']],
        '6': ['مبادرة أثر طيب', 'social', 'مجتمع وطلاب', '2024-11-25', '25 تشرين الثاني 2024', '09:30 صباحاً', 'طرطوس', 'اصنع أثراً طيباً وساهم في تنمية مجتمعك من خلال العمل التطوعي والمشاركة الفاعلة.', 'assets/img/social-2.jpg', ['المساهمة في خدمة المجتمع.', 'اكتساب خبرات تطوعية.'], ['assets/img/social-1.jpg', 'assets/img/social-3.jpg']]
    };

    // 6. Details Page
    const title = $('detailTitle');
    if (title) {
        const params = new URLSearchParams(location.search);
        const id = params.get('id') || '1';
        const [t, cat, tag, dateStr, dateAr, time, loc, desc, imgPath, list, gallery] = data[id] || data['1'];
        
        title.textContent = t;
        setText('titleHero', t);
        setText('detailDate', dateAr);
        setText('detailTime', time);
        setText('detailLoc', loc);
        setText('mapLoc', loc);
        setText('desc', desc);
        document.title = t + ' | دليل الفعاليات';

        const tagEl = $('detailTag'); tagEl.textContent = tag; tagEl.className = 'badge tag-' + cat;
        const img = $('detailImg'); img.src = imgPath; img.alt = t;

        if ($('detailList')) $('detailList').innerHTML = list.map(item => `<li>${item}</li>`).join('');
        if ($('detailGallery')) $('detailGallery').innerHTML = gallery.map(src => `<div class="col-6"><img src="${src}" class="gallery" alt="صورة"></div>`).join('');

        const relContainer = $('relatedEvents');
        if (relContainer) {
            const others = Object.entries(data).filter(([k]) => k !== id).slice(0, 3);
            relContainer.innerHTML = others.map(([k, ev]) => `
                <div class="col-md-6 col-lg-4">
                    <article class="cardx h-100 d-flex flex-column">
                        <img src="${ev[8]}" alt="${ev[0]}" style="height: 200px; object-fit: cover;">
                        <div class="pad text-center d-flex flex-column flex-grow-1">
                            <span class="badge tag-${ev[1]} mx-auto mt-2">${ev[2]}</span>
                            <h3 class="mt-2">${ev[0]}</h3>
                            <p class="flex-grow-1">${ev[7]}</p>
                            <div class="meta mb-3">📅 ${ev[4]} · 📍 ${ev[6]}</div>
                            <a class="btn btn-warm w-100 mt-auto" href="event.html?id=${k}">تفاصيل الفعالية</a>
                        </div>
                    </article>
                </div>`).join('');
        }

        $('calendar').onclick = () => {
            const start = dateStr.replaceAll('-', '') + 'T110000', end = dateStr.replaceAll('-', '') + 'T120000';
            const ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'BEGIN:VEVENT', `DTSTART:${start}`, `DTEND:${end}`, `SUMMARY:${t}`, `LOCATION:${loc}`, 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
            const a = document.createElement('a');
            a.href = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' }));
            a.download = 'event.ics'; a.click();
            setText('actionMsg', 'تم تجهيز ملف تقويم تجريبي للتنزيل.');
        };

        $('share').onclick = async () => {
            try {
                if (navigator.share) await navigator.share({ title: t, url: location.href });
                else if (navigator.clipboard && isSecureContext) {
                    await navigator.clipboard.writeText(location.href);
                    setText('actionMsg', 'تم نسخ رابط الفعالية.');
                } else prompt('انسخ رابط الفعالية', location.href);
            } catch (e) {
                if (e.name !== 'AbortError') setText('actionMsg', 'انسخ الرابط من شريط العنوان للمشاركة.');
            }
        };
    }

    // 7. Contact Form
    const form = $('contactForm');
    if (form) {
        const alert = $('alert'), inputs = [$('name'), $('email'), $('message')];
        
        form.addEventListener('submit', e => {
            e.preventDefault();
            inputs.forEach(x => x.classList.toggle('is-invalid', !x.checkValidity()));
            alert.classList.remove('d-none', 'alert-success', 'alert-danger');
            
            if (!form.checkValidity()) {
                alert.classList.add('alert-danger');
                alert.textContent = 'يرجى تصحيح الحقول المحددة قبل المتابعة.';
                form.querySelector(':invalid')?.focus();
                return;
            }
            alert.classList.add('alert-success');
            alert.textContent = `شكراً ${inputs[0].value.trim()}، تم التحقق من البيانات بنجاح. هذا نموذج تجريبي ولا يرسل بريداً فعلياً.`;
            form.reset();
            inputs.forEach(x => x.classList.remove('is-invalid'));
        });
        inputs.forEach(x => x.addEventListener('input', () => x.checkValidity() && x.classList.remove('is-invalid')));
    }

    // 8. Modal Booking
    const bookingForm = $('bookingForm');
    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = $('bookName').value, seats = $('bookSeats').value, alertBox = $('bookingAlert');
            alertBox.classList.remove('d-none');
            alertBox.textContent = `شكراً ${name}، تم تأكيد حجزك الوهمي لـ ${seats} مقعد بنجاح!`;
            bookingForm.reset();
            setTimeout(() => alertBox.classList.add('d-none'), 3000);
        });
    }
});