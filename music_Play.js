/*
    1. Render songs (quá trình tạo ra và hiển thị dữ liệu trực quan hoặc kết quả trên màn hình)
    2. Scroll to top-->ok
    3. Play, Pause, Seek (tua)--> ok
    4. CD rotate-->ok
    5. Next, Prev-->ok
    6. Random-->ok
    7. Next and Repeat when ended-->ok
    8. Active song
    9. Scroll active song into view
    10. Play song when click
    11. add volume
*/
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PlAYER_STORAGE_KEY = "F8_PLAYER";

const player = $(".player");
const cd = $(".cd");
const heading = $("header h2");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const playBtn = $(".btn-toggle-play");
const progress = $("#progress");
const prevBtn = $(".btn-prev");
const nextBtn = $(".btn-next");
const randomBtn = $(".btn-random");
const repeatBtn = $(".btn-repeat");
const playlist = $(".playlist");

const app = {
    currentIndex: 0, // Phải lấy ra được song đầu tiên
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: {},
    // (1/2) Uncomment the line below to use localStorage
    // config: JSON.parse(localStorage.getItem(PlAYER_STORAGE_KEY)) || {},
    songs: [
        {
            name: 'Lao tâm khổ tứ',
            singer: 'Thanh hưng',
            path: './assets/music/song1.mp3',
            image: './assets/img/img1.jpg',
        },
        {
            name: 'Ngày em đẹp nhất',
            singer: 'Tama',
            path: './assets/music/song2.mp3',
            image: './assets/img/img2.jpg',
        },
        {
            name: 'Nơi này có anh',
            singer: 'Sơn Tùng MTP',
            path: './assets/music/song3.mp3',
            image: './assets/img/img3.jpg',
        },
        {
            name: 'Ôm trọn nỗi nhớ',
            singer: 'Rum',
            path: './assets/music/song4.mp3',
            image: './assets/img/img4.jpg',
        },
        {
            name: 'Có ai hẹn hò cùng em chưa',
            singer: 'Quân A.P',
            path: './assets/music/song5.mp3',
            image: './assets/img/img5.jpg',
        },
        {
            name: 'Điều anh biết',
            singer: 'Chi Dân',
            path: './assets/music/song6.mp3',
            image: './assets/img/img6.jpg',
        },
        {
            name: 'Nếu ngày ấy',
            singer: 'khởi My',
            path: './assets/music/song7.mp3',
            image: './assets/img/img7.jpg',
        },
        {
            name: 'Đáp án cuối cùng',
            singer: 'PhúcXP, Freak D',
            path: './assets/music/song8.mp3',
            image: './assets/img/img8.jpg',
        }
    ],
    setConfig: function (key, value) {
        this.config[key] = value;
        // (2/2) Uncomment the line below to use localStorage
        // localStorage.setItem(PlAYER_STORAGE_KEY, JSON.stringify(this.config)); 
    },
    render: function () {
        const htmls = this.songs.map((song, index) => {
            return `
                        <div class="song ${index === this.currentIndex ? "active" : ""
                }" data-index="${index}">
                            <div class="thumb"
                                style="background-image: url('${song.image}')">
                            </div>
                            <div class="body">
                                <h3 class="title">${song.name}</h3>
                                <p class="author">${song.singer}</p>
                            </div>
                            <div class="option">
                                <i class="fas fa-ellipsis-h"></i>
                            </div>
                        </div>
                    `;
        });
        playlist.innerHTML = htmls.join("");
    },
    defineProperties: function () { // hàm định nghĩa ra những thuộc tính
        Object.defineProperty(this, "currentSong", { // this ở đây là chỉ đối tượng app
            get: function () {  // Lấy ra song đầu tiên 
                return this.songs[this.currentIndex];
            }
        }); //Object.defineProperty(object, property, descriptor) 
    },
    handleEvents: function () {
        const _this = this;
        const cdWidth = cd.offsetWidth;  // Lấy ra kích thước mặc định 

        // Xử lý CD quay / dừng
        // Handle CD spins (quay vòng tròn một cách liên tục) / stops
        const cdThumbAnimate = cdThumb.animate([
            { transform: "rotate(360deg)" }
        ], {
            duration: 10000, // 10 seconds
            iterations: Infinity //  Số lần lặp lại hoạt ảnh, trong trường hợp này là vô hạn 
        });
        cdThumbAnimate.pause();

        // Xử lý phóng to / thu nhỏ CD
        // Handles CD enlargement / reduction
        document.onscroll = function () {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newCdWidth = cdWidth - scrollTop;

            cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0;
            // cd.style.opacity = newCdWidth / cdWidth;  // --> ra tỉ lệ
        };

        // Xử lý khi click play
        // Handle when click play
        playBtn.onclick = function () {
            if (_this.isPlaying) {
                audio.pause();
            } else {
                audio.play();
            }
        };

        // Khi song được play
        audio.onplay = function () {
            _this.isPlaying = true;
            player.classList.add("playing");
            cdThumbAnimate.play();
        };

        // Khi song bị pause
        audio.onpause = function () {
            _this.isPlaying = false;
            player.classList.remove("playing");
            cdThumbAnimate.pause();
        };

        // Khi tiến độ bài hát thay đổi
        // When the song progress changes
        audio.ontimeupdate = function () {
            if (audio.duration) {
                const progressPercent = Math.floor(
                    (audio.currentTime / audio.duration) * 100
                );
                progress.value = progressPercent;
            }
        };

        // Xử lý khi tua song
        progress.onchange = function (e) {
            const seekTime = (audio.duration / 100) * e.target.value;  // số giây = (tổng t/g song / 100) * số phần trăm
            audio.currentTime = seekTime;
            // e.target là phần tử progress
        };

        // Khi next song
        nextBtn.onclick = function () {
            if (_this.isRandom) {
                _this.playRandomSong();
            } else {
                _this.nextSong();
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
        };

        // Khi prev song
        prevBtn.onclick = function () {
            if (_this.isRandom) {
                _this.playRandomSong();
            } else {
                _this.prevSong();
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
        };

        // Xử lý bật / tắt random song
        randomBtn.onclick = function (e) {
            _this.isRandom = !_this.isRandom;
            _this.setConfig("isRandom", _this.isRandom);
            randomBtn.classList.toggle("active", _this.isRandom); //  được sử dụng để ẩn hoặc hiện phần tử HTML được chọn
        };

        // Xử lý lặp lại một song
        repeatBtn.onclick = function (e) {
            _this.isRepeat = !_this.isRepeat;
            _this.setConfig("isRandom", _this.isRandom);
            repeatBtn.classList.toggle("active", _this.isRepeat); //  được sử dụng để ẩn hoặc hiện phần tử HTML được chọn
        };

        // Xử lý next song khi audio ended
        audio.onended = function () {
            if (_this.isRepeat) {
                audio.play();
            } else {
                nextBtn.click(); //nó sẽ hiểu là bấm click vào nút next 
            }
        };

        // Lắng nghe hành vi click vào playlist
        playlist.onclick = function (e) {
            const songNode = e.target.closest(".song:not(.active)"); //element.closest(selectors) --> trả về element chính nó or thẻ cha, ông của nó nếu không tìm thấy sẽ trả về null.

            if (songNode || e.target.closest(".option")) {
                // Xử lý khi click vào song
                if (songNode) {
                    _this.currentIndex = Number(songNode.dataset.index); // dataset.index = getAttribute('data-index') --> nếu đặt data-__ thì hay dùng dataset.
                    _this.loadCurrentSong();
                    _this.render();
                    audio.play();
                }

                // Xử lý khi click vào song option
                if (e.target.closest(".option")) {
                }
            }
        };
    },
    scrollToActiveSong: function () {
        setTimeout(() => {
            $(".song.active").scrollIntoView({
                behavior: "smooth",
                block: "nearest"
            });
        }, 300);
    },
    loadCurrentSong: function () {
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;
    },
    loadConfig: function () {
        this.isRandom = this.config.isRandom;
        this.isRepeat = this.config.isRepeat;
    },
    nextSong: function () {
        this.currentIndex++;
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
    },
    prevSong: function () {
        this.currentIndex--;
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1;
        }
        this.loadCurrentSong();
    },
    playRandomSong: function () {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * this.songs.length);
        } while (newIndex === this.currentIndex);

        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },
    start: function () {
        // Gán cấu hình từ config vào ứng dụng
        // Assign configuration from config to application
        this.loadConfig();

        // Định nghĩa các thuộc tính cho object
        // Defines properties for the object
        this.defineProperties();

        // Lắng nghe / xử lý các sự kiện (DOM events)
        // Listening / handling events (DOM events)
        this.handleEvents();

        // Tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
        // Load the first song information into the UI when running the app
        this.loadCurrentSong();

        // Render playlist
        this.render();

        // Hiển thị trạng thái ban đầu của button repeat & random
        // Display the initial state of the repeat & random button
        // randomBtn.classList.toggle("active", this.isRandom);
        // repeatBtn.classList.toggle("active", this.isRepeat);
    }
};

app.start();

