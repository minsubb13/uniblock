// 전역 변수
let token = localStorage.getItem('token');

// DOM 요소
const authSection = document.getElementById('auth-section');
const profileSection = document.getElementById('profile-section');
const messageDiv = document.getElementById('message');
const errorDiv = document.getElementById('error');

// 폼 요소
const registerForm = document.getElementById('register-form');
const loginForm = document.getElementById('login-form');
const profileForm = document.getElementById('profile-form');
const logoutBtn = document.getElementById('logout-btn');

// 이벤트 리스너
registerForm.addEventListener('submit', handleRegister);
loginForm.addEventListener('submit', handleLogin);
profileForm.addEventListener('submit', handleProfileUpdate);
logoutBtn.addEventListener('click', handleLogout);

// 페이지 로드 시 실행
checkAuthStatus();

// 함수

function checkAuthStatus() {
    if (token) {
        authSection.style.display = 'none';
        profileSection.style.display = 'block';
        fetchProfile();
    } else {
        authSection.style.display = 'none';
        profileSection.style.display = 'block';

        loginForm.reset();
    }
}

async function handleRegister(e) {
    e.preventDefault();
    const username = document.getElementById('reg-username').value;
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;
    const password2 = document.getElementById('reg-password2').value;

    try {
        const response = await fetch('http://127.0.0.1:8000/user/register/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, email, password, password2 }),
        });

        if (!response.ok) throw new Error('Registration failed');

        alert('Registration successful. Please log in.');
        registerForm.reset();
    } catch (error) {
        alert(error.message);
    }
}

async function handleLogin(e) {
    e.preventDefault();
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    try {
        const response = await fetch('http://127.0.0.1:8000/user/login/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        if (!response.ok) throw new Error('Login failed');

        const data = await response.json();
        token = data.token;
        localStorage.setItem('token', token);
        alert('Login successful');
        checkAuthStatus(); // redirect
    } catch (error) {
        showError(error.message);
    }
}

async function handleProfileUpdate(e) {
    e.preventDefault();
    const nickname = document.getElementById('nickname').value;
    const department = document.getElementById('department').value;

    try {
        const response = await fetch('http://127.0.0.1:8000/user/profile/', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${token}`,
            },
            body: JSON.stringify({ nickname, department }),
        });

        if (!response.ok) throw new Error('Profile update failed');

        alert('Profile updated successfully');
        redirectToPostPage();
    } catch (error) {
        alert(error.message);
    }
}

function handleLogout() {
    localStorage.removeItem('token');
    token = null;
    checkAuthStatus();
    showMessage('로그아웃되었습니다. 로그인 페이지로 이동합니다.');
    
    // 로그아웃 후 로그인 섹션 표시 및 프로필 섹션 숨김
    authSection.style.display = 'block';
    profileSection.style.display = 'none';
    
    // 로그인 폼 초기화 (선택사항)
    loginForm.reset();
}

async function fetchProfile() {
    try {
        const response = await fetch('http://127.0.0.1:8000/user/profile/', {
            headers: {
                'Authorization': `Token ${token}`,
            },
        });

        if (!response.ok) throw new Error('Failed to fetch profile');

        const data = await response.json();
        document.getElementById('nickname').value = data.nickname;
        document.getElementById('department').value = data.department;
        console.log(`name : ${data.nickname}, department : ${data.department}`);
    } catch (error) {
        console.log(error.message);
    }

}

function redirectToPostPage() {
    window.location.href = 'http://127.0.0.1:8000/post/'; // 게시판 페이지로 리다이렉트
}

function showMessage(message) {
    messageDiv.textContent = message;
    errorDiv.textContent = '';
}

function showError(error) {
    errorDiv.textContent = error;
    messageDiv.textContent = '';
}