export const CDN_URL = `${process.env.API_ORIGIN}/content/weblarek`;
export const API_URL = `${process.env.API_ORIGIN}/api/weblarek`;

export const settings = {};

export const ERROR_MESSAGES = {
    required: "Пожалуйста, заполните это поле",
    invalidEmail: "Введите email в формате name@example.com",
    invalidPhone: "Введите номер телефона в формате: +71234567890",
    emailRequired: "Необходимо указать email",
    emailInvalid: "Введите email в формате name@example.com",
    phoneRequired: "Необходимо указать телефон",
    phoneInvalid: "Введите номер в формате +71234567890"
};

// Регулярные выражения для валидации
export const REGEX = {
    // Для адреса - минимум 7 символов, буквы, цифры и спец. символы
    ADDRESS: /^[а-яА-ЯёЁa-zA-Z0-9\s\/.,-]{7,}$/,
    
    // Для email - стандартный формат email
    EMAIL: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
    
    // Для телефона - российский формат телефона
    PHONE: /^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{10}$/
};

export const CATEGORY_COLORS: Record<string, string> = {
    "дополнительное": "additional",
    "софт-скил": "soft",
    "кнопка": "button",
    "хард-скил": "hard",
    "другое": "other"
};