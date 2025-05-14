function initializeLocalStorage() {
    if (!localStorage.getItem('resumeData')) {
        localStorage.setItem('resumeData', JSON.stringify(profile));
    }
}


function makeEditable() {
    // Əlaqə məlumatları
    document.querySelector('.contact').addEventListener('click', function(e) {
        if(e.target.tagName === 'P') {
            e.target.contentEditable = true;
            e.target.focus();
        }
    });

    // Təhsil
    document.querySelectorAll('.education li').forEach(item => {
        item.addEventListener('click', function(e) {
            if (e.target === item || e.target.tagName === 'STRONG') {
                item.contentEditable = true;
                item.focus();
            }
        });
    });

    // Bacarıqlar
    document.querySelectorAll('.skill li').forEach(item => {
        item.addEventListener('click', () => {
            item.contentEditable = true;
            item.focus();
        });
    });

    // Dillər
    document.querySelectorAll('.languages li').forEach(item => {
        item.addEventListener('click', () => {
            item.contentEditable = true;
            item.focus();
        });
    });

    // Ad, soyad və ixtisas
    document.querySelectorAll('.name, .surname, .specialization').forEach(item => {
        item.addEventListener('click', () => {
            item.contentEditable = true;
            item.focus();
        });
    });

    // Profil təsviri
    document.querySelector('.right-side > div:nth-child(2) p').addEventListener('click', function(e) {
        e.target.contentEditable = true;
        e.target.focus();
    });

    // İş təcrübəsi
    document.querySelectorAll('.right-side > div:nth-child(3) h3, .right-side > div:nth-child(3) p, .right-side > div:nth-child(3) li').forEach(item => {
        item.addEventListener('click', () => {
            item.contentEditable = true;
            item.focus();
        });
    });

    // Referanslar
    document.querySelectorAll('.first-and-second-containers h3, .first-and-second-containers p').forEach(item => {
        item.addEventListener('click', () => {
            item.contentEditable = true;
            item.focus();
        });
    });
}

function setupAutoSave() {
    document.addEventListener('focusout', function(e) {
        if(e.target.contentEditable === 'true') {
            e.target.contentEditable = false;
            updateProfileData();
        }
    });
}

function updateProfileData() {
    // Şəxsi məlumatlar
    profile.name = document.querySelector('.name').innerText;
    profile.surname = document.querySelector('.surname').innerText;
    profile.specialization = document.querySelector('.specialization').innerText;

    // Əlaqə məlumatları
    const contactLines = document.querySelector('.contact p').innerText.split('\n');
    profile.contact = {
        phone: contactLines[0] || '',
        email: contactLines[1] || '',
        address: contactLines[2] || '',
        website: contactLines[3] || ''
    };

    // Təhsil
    const eduItems = document.querySelectorAll('.education li');
    profile.education = Array.from(eduItems).map((item, index) => {
        const lines = item.innerText.split('\n').filter(line => line.trim() !== '');
        return {
            year: lines[0] ? lines[0].replace('<strong>', '').replace('</strong>', '') : '',
            university: lines[1] || '',
            degree: lines[2] || '',
            gpa: lines[3] || ''
        };
    });

    // Bacarıqlar
    const skillItems = document.querySelectorAll('.skill li');
    profile.skills = Array.from(skillItems).map(item => item.innerText.replace('×', '').trim());

    // Dillər
    const languageItems = document.querySelectorAll('.languages li');
    profile.languages = Array.from(languageItems).map(item => item.innerText.replace('×', '').trim());

    // Profil təsviri
    profile.profileDescription = document.querySelector('.right-side > div:nth-child(2) p').innerText;

    // İş təcrübəsi
    const experienceElements = document.querySelectorAll('.right-side > div:nth-child(3) > div');
    profile.experience = Array.from(experienceElements).map(exp => {
        return {
            company: exp.querySelector('h3').innerText,
            position: exp.querySelector('p').innerText,
            tasks: Array.from(exp.querySelectorAll('li')).map(li => li.innerText)
        };
    });

    // Referanslar
    const referenceElements = document.querySelectorAll('.first-and-second-containers > div');
    profile.references = Array.from(referenceElements).map(ref => {
        const lines = ref.querySelector('p').innerText.split('\n');
        return {
            name: ref.querySelector('h3').innerText,
            title: lines[0],
            phone: lines[1] ? lines[1].replace('Phone: ', '') : '',
            email: lines[2] ? lines[2].replace('Email: ', '') : ''
        };
    });

    localStorage.setItem('resumeData', JSON.stringify(profile));

}


function validateForm() {
    let isValid = true;
    const errorMessages = [];
    
    // Ad validasiyası (yalnız hərflər)
    const nameElement = document.querySelector('.name');
    const nameRegex = /^[A-Za-z\u0400-\u04FF]+$/; // İngilis və Azərbaycan hərfləri
    if (!nameRegex.test(nameElement.innerText.trim())) {
        nameElement.classList.add('error');
        errorMessages.push('Ad yalnız hərflərdən ibarət olmalıdır');
        isValid = false;
    } else {
        nameElement.classList.remove('error');
    }
    
    // Soyad validasiyası (yalnız hərflər)
    const surnameElement = document.querySelector('.surname');
    if (!nameRegex.test(surnameElement.innerText.trim())) {
        surnameElement.classList.add('error');
        errorMessages.push('Soyad yalnız hərflərdən ibarət olmalıdır');
        isValid = false;
    } else {
        surnameElement.classList.remove('error');
    }
    
    // Email validasiyası (daha dəqiq regex)
    const emailText = document.querySelector('.contact p').innerText.split('\n')[1];
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailText.trim())) {
        document.querySelector('.contact p').classList.add('error');
        errorMessages.push('Düzgün email ünvanı daxil edin');
        isValid = false;
    } else {
        document.querySelector('.contact p').classList.remove('error');
    }
    
    // Telefon validasiyası
    const phoneText = document.querySelector('.contact p').innerText.split('\n')[0];
    const phoneRegex = /^[\+\d\s\-\(\)]+$/;
    if (!phoneRegex.test(phoneText.trim())) {
        document.querySelector('.contact p').classList.add('error');
        errorMessages.push('Telefon yalnız rəqəm və +, -, () simvollarından ibarət olmalıdır');
        isValid = false;
    }
    
    // Təhsil illəri validasiyası
    document.querySelectorAll('.education li').forEach((item, index) => {
        const lines = item.innerText.split('\n').filter(line => line.trim() !== '');
        if (lines.length > 0) {
            const yearRegex = /^[\d\-\s]+$/;
            if (!yearRegex.test(lines[0].replace('<strong>', '').replace('</strong>', '').trim())) {
                item.classList.add('error');
                errorMessages.push(`${index + 1}. təhsil maddəsində il yalnız rəqəm və tire (-) simvolundan ibarət olmalıdır`);
                isValid = false;
            } else {
                item.classList.remove('error');
            }
        }
    });
    
    // Xəta mesajlarını göstər
    if (errorMessages.length > 0) {
        alert('Xəta: ' + errorMessages.join('\n'));
    } else if (isValid) {
        alert('Məlumatlar uğurla yadda saxlanıldı!');
    }
    
    return isValid;
}

function setupSaveButton() {
    document.getElementById('save-btn').addEventListener('click', function() {
        updateProfileData();
        if (validateForm()) {
            alert('Məlumatlar uğurla yadda saxlanıldı!');
        } else {
            alert('Xəta: Zəhmət olmasa bütün məlumatları düzgün daxil edin!');
        }
    });
}



// Əlavə etmə funksiyaları
function setupAddButtons() {
    document.querySelectorAll('.add-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const section = this.getAttribute('data-section');
            addNewItem(section);
        });
    });
}

function addNewItem(section) {
    switch(section) {
        case 'education':
            profile.education.push({
                year: 'Yeni il (redaktə edin)',
                university: 'Yeni universitet (redaktə edin)',
                degree: 'Yeni dərəcə (redaktə edin)'
            });
            break;
        case 'skills':
            profile.skills.push('Yeni bacarıq (redaktə edin)');
            break;
        case 'languages':
            profile.languages.push('Yeni dil (redaktə edin)');
            break;

        case 'experience':
            profile.experience.push({
                company: 'Yeni şirkət (redaktə edin)',
                position: 'Yeni vəzifə (redaktə edin)',
                tasks: ['Yeni vəzifə öhdəliyi (redaktə edin)']
            });
            break;
            
        case 'references':
            profile.references.push({
                name: 'Yeni referans (redaktə edin)',
                title: 'Yeni titul (redaktə edin)',
                phone: 'Yeni telefon (redaktə edin)',
                email: 'Yeni email (redaktə edin)'
            });
            break;    
    }
    renderLeftSide();
    makeEditable();
    setupAddButtons();
    setupDeleteButtons();
    setupAddTaskButtons();
}

// Yeni vəzifə əlavə etmə funksiyası
function setupAddTaskButtons() {
    document.querySelectorAll('.add-task-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            profile.experience[index].tasks.push('Yeni vəzifə öhdəliyi (redaktə edin)');
            renderRightSide();
            makeEditable();
            setupAddButtons();
            setupDeleteButtons();
            setupAddTaskButtons();
        });
    });
}


// Silmə düymələri 
function setupDeleteButtons() {
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const item = this.closest('li, [class$="-item"]');
            
            if (!item) return;

            // Təhsil, bacarıq və ya dil silinəcəksə
            if (item.tagName === 'LI') {
                const parentSection = item.closest('.education, .skill, .languages');
                if (parentSection) {
                    const sectionType = parentSection.classList[0];
                    const index = Array.from(item.parentElement.children).indexOf(item);
                    removeItem(sectionType, index);
                }
            }
            // İş təcrübəsi silinəcəksə
            else if (item.classList.contains('experience-item')) {
                const index = parseInt(item.getAttribute('data-index'));
                removeItem('experience', index);
            }
            // Referans silinəcəksə
            else if (item.classList.contains('reference-item')) {
                const index = parseInt(item.getAttribute('data-index'));
                removeItem('references', index);
            }
        });
    });
}


function removeItem(section, index) {
    if (section === 'education') {
        profile.education.splice(index, 1);
    } 
    else if (section === 'skill') {
        profile.skills.splice(index, 1);
    }
    else if (section === 'languages') {
        profile.languages.splice(index, 1);
    }
    else if (section === 'experience') {
        profile.experience.splice(index, 1);
    }
    else if (section === 'references') {
        profile.references.splice(index, 1);
    }
    else if (section === 'task') {
        const [expIndex, taskIndex] = index.split('-').map(Number);
        profile.experience[expIndex].tasks.splice(taskIndex, 1);
    }

    // Yenilə və LocalStorage-ə yadda saxla
    renderLeftSide();
    renderRightSide();
    makeEditable();
    setupDeleteButtons();
    updateProfileData(); 
}


// window.onload funksiyası
window.onload = function() {
    initializeLocalStorage();
    
    // LocalStorage-dən məlumatları yüklə
    const savedData = localStorage.getItem('resumeData');
    if (savedData) {
        Object.assign(profile, JSON.parse(savedData));
    }
    
    renderLeftSide();
    renderRightSide();
    makeEditable();
    setupAutoSave();
    setupAddButtons();
    setupDeleteButtons();
    setupAddTaskButtons();
    setupSaveButton();
};