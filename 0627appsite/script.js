// Initial mock data
const mockApps = [
    {
        id: "app_01",
        title: "초등 분수 개념 마스터 퀴즈",
        url: "https://ko.khanacademy.org/math",
        categories: ["수학", "초등", "퀴즈형"],
        thumbnailUrl: "https://images.unsplash.com/photo-1596495578065-6e0763fa1178?auto=format&fit=crop&q=80&w=400",
        createdAt: "2026-06-27"
    },
    {
        id: "app_02",
        title: "기초 영단어 카드 놀이",
        url: "https://quizlet.com",
        categories: ["영어", "초등"],
        thumbnailUrl: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&q=80&w=400",
        createdAt: "2026-06-27"
    },
    {
        id: "app_03",
        title: "블록 코딩으로 게임 만들기",
        url: "https://scratch.mit.edu",
        categories: ["코딩", "중등"],
        thumbnailUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=400",
        createdAt: "2026-06-27"
    }
];

// Initialize Data in LocalStorage if not exists
if (!localStorage.getItem('eduApps')) {
    localStorage.setItem('eduApps', JSON.stringify(mockApps));
}

let apps = JSON.parse(localStorage.getItem('eduApps'));

// DOM Elements
const appGrid = document.getElementById('appGrid');
const totalAppsStat = document.getElementById('totalAppsStat');
const searchInput = document.getElementById('searchInput');
const filterBtns = document.querySelectorAll('.filter-btn');

// Render Apps
function renderApps(filteredApps) {
    appGrid.innerHTML = '';
    
    if (filteredApps.length === 0) {
        appGrid.innerHTML = '<p style="text-align:center; grid-column: 1/-1; color:#777; padding:40px;">일치하는 앱이 없습니다.</p>';
        return;
    }

    filteredApps.forEach(app => {
        const card = document.createElement('div');
        card.className = 'app-card';
        
        const tagsHtml = app.categories.map(cat => `<span class="tag">${cat.trim()}</span>`).join('');
        
        card.innerHTML = `
            <img src="${app.thumbnailUrl}" alt="${app.title}" class="card-image">
            <div class="card-content">
                <div class="card-tags">
                    ${tagsHtml}
                </div>
                <h3 class="card-title">${app.title}</h3>
                <button class="btn-launch" onclick="launchApp('${app.title}', '${app.url}')">실행하기 🚀</button>
            </div>
        `;
        appGrid.appendChild(card);
    });

    totalAppsStat.textContent = apps.length;
}

// Filter and Search Logic
function filterAndSearch() {
    const searchTerm = searchInput.value.toLowerCase();
    const activeFilter = document.querySelector('.filter-btn.active').dataset.category;

    let result = apps.filter(app => {
        const matchSearch = app.title.toLowerCase().includes(searchTerm) || 
                            app.categories.some(cat => cat.toLowerCase().includes(searchTerm));
        const matchCategory = activeFilter === 'all' || app.categories.includes(activeFilter);
        return matchSearch && matchCategory;
    });

    renderApps(result);
}

// Event Listeners for Filters
filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        filterBtns.forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        filterAndSearch();
    });
});

searchInput.addEventListener('input', filterAndSearch);

// Launch App Modal
const runnerModal = document.getElementById('runnerModal');
const runnerIframe = document.getElementById('runnerIframe');
const runnerTitle = document.getElementById('runnerTitle');
const runnerNewTab = document.getElementById('runnerNewTab');

function launchApp(title, url) {
    runnerTitle.textContent = title;
    runnerIframe.src = url;
    runnerNewTab.href = url;
    runnerModal.classList.add('show');
}

document.getElementById('closeRunnerBtn').addEventListener('click', () => {
    runnerModal.classList.remove('show');
    runnerIframe.src = '';
});

// Admin Modal Logic
const adminModal = document.getElementById('adminModal');
const addAppBtn = document.getElementById('addAppBtn');
const closeModalBtn = document.getElementById('closeModalBtn');
const addAppForm = document.getElementById('addAppForm');
const appThumbnail = document.getElementById('appThumbnail');
const imagePreview = document.getElementById('imagePreview');
let base64Image = '';

addAppBtn.addEventListener('click', () => adminModal.classList.add('show'));
closeModalBtn.addEventListener('click', () => adminModal.classList.remove('show'));

// Image Upload Preview
appThumbnail.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            base64Image = event.target.result;
            imagePreview.style.backgroundImage = `url(${base64Image})`;
            imagePreview.textContent = '';
        };
        reader.readAsDataURL(file);
    }
});

// Submit New App
addAppForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const adminCode = document.getElementById('adminCode').value;
    if (adminCode !== 'admin123') {
        alert('관리자 비밀번호가 일치하지 않습니다.');
        return;
    }

    const title = document.getElementById('appTitle').value;
    const url = document.getElementById('appUrl').value;
    const categoryStr = document.getElementById('appCategory').value;
    const categories = categoryStr.split(',').map(c => c.trim()).filter(c => c);
    
    if (!base64Image) {
        alert('이미지를 업로드해주세요.');
        return;
    }

    const newApp = {
        id: 'app_' + Date.now(),
        title,
        url,
        categories,
        thumbnailUrl: base64Image,
        createdAt: new Date().toISOString().split('T')[0]
    };

    apps.unshift(newApp); // Add to beginning
    localStorage.setItem('eduApps', JSON.stringify(apps));
    
    // Reset Form
    addAppForm.reset();
    base64Image = '';
    imagePreview.style.backgroundImage = 'none';
    imagePreview.textContent = '이미지 미리보기';
    
    adminModal.classList.remove('show');
    filterAndSearch(); // Re-render
    
    alert('앱이 성공적으로 등록되었습니다!');
});

// Initial Render
renderApps(apps);

// Policy Modal Logic
const policyModal = document.getElementById('policyModal');
const closePolicyBtn = document.getElementById('closePolicyBtn');
const policyTitle = document.getElementById('policyTitle');
const policyText = document.getElementById('policyText');
const openTermsBtn = document.getElementById('openTermsBtn');
const openPrivacyBtn = document.getElementById('openPrivacyBtn');

const privacyTextContent = `[제 1 부] 개인정보처리방침

본 개인정보처리방침은 'EduLauncher'(이하 "본 포털")가 사용자의 정보를 어떻게 처리하고 보호하는지 안내합니다.

1. 수집하는 정보 항목
본 포털은 별도의 회원가입이나 로그인 절차가 없으며, 외부 서버(온라인 데이터베이스)로 사용자의 정보를 전송하거나 수집하지 않습니다.
어드민(관리자) 기능 사용 시 입력하시는 '앱 제목', '앱 링크(URL)', '카테고리', '썸네일 이미지', '관리자 비밀번호' 정보만 사용됩니다.

2. 정보의 처리 및 보관 방법 (로컬 저장소 활용)
본 포털은 관리자가 등록한 웹앱 정보를 오직 사용자 본인의 기기(브라우저의 로컬 스토리지)에만 저장합니다. 
비유하자면, 남들이 볼 수 있는 공개된 게시판에 글을 올리는 것이 아니라, 내 컴퓨터 안의 즐겨찾기 목록에만 기록을 남겨두는 것과 같습니다.

3. 정보의 제3자 제공
본 포털은 수집한 어떠한 정보도 외부 서버나 제3자에게 제공, 공유, 판매하지 않습니다.

4. 정보의 파기
사용자는 언제든지 본인의 브라우저 설정에서 '인터넷 사용 기록 지우기' 또는 '캐시 및 사이트 데이터 지우기'를 통해 기기에 저장된 모든 등록 앱 데이터를 완전히 삭제할 수 있습니다.`;

const termsTextContent = `[제 2 부] 이용약관

제 1 조 (목적)
본 약관은 'EduLauncher'(이하 "본 포털")의 이용 조건 및 포털과 사용자 간의 권리, 의무, 책임 사항을 규정함을 목적으로 합니다.

제 2 조 (서비스의 제공 및 변경)
본 포털은 흩어져 있는 교육용 학습 웹앱들을 한곳에서 쉽게 찾아보고 실행할 수 있는 통합 런처 기능을 무료로 제공합니다. 서비스의 내용과 제공되는 기본 학습 앱 목록은 향후 업데이트를 통해 변경될 수 있습니다.

제 3 조 (사용자의 의무)
1. 사용자는 어드민 기능을 활용하여 앱을 등록할 때, 저작권을 침해하거나 교육 목적에 어긋나는 유해한 웹사이트를 등록해서는 안 됩니다.
2. 본 포털에 추가한 데이터는 사용자 기기에만 저장되므로, 기기 변경이나 브라우저 데이터 삭제로 인한 데이터 유실의 책임은 사용자에게 있습니다. 백업이 필요한 경우 별도로 기록을 보관해야 합니다.

제 4 조 (면책 조항)
본 포털은 사용자의 기기 내에서 동작하는 웹 어플리케이션으로, 포털에 등록된 외부 학습 웹앱의 접속 장애나 콘텐츠 오류, 또는 브라우저 환경 문제로 인해 발생한 데이터 손실에 대해서는 개발자가 책임을 지지 않습니다.

제 5 조 (기타)
본 약관 및 개인정보처리방침에 명시되지 않은 사항은 관련 법령 및 일반적인 관례에 따릅니다.`;

function openPolicyModal(title, text) {
    policyTitle.textContent = title;
    policyText.textContent = text;
    policyModal.classList.add('show');
}

openTermsBtn.addEventListener('click', (e) => {
    e.preventDefault();
    openPolicyModal('이용약관', termsTextContent);
});

openPrivacyBtn.addEventListener('click', (e) => {
    e.preventDefault();
    openPolicyModal('개인정보처리방침', privacyTextContent);
});

closePolicyBtn.addEventListener('click', () => {
    policyModal.classList.remove('show');
});

// Close modals when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === adminModal) adminModal.classList.remove('show');
    if (e.target === runnerModal) runnerModal.classList.remove('show');
    if (e.target === policyModal) policyModal.classList.remove('show');
});
