export const CDN_URL = `${process.env.API_ORIGIN}/content/weblarek`;
export const API_URL = `${process.env.API_ORIGIN}/api/weblarek`;

export const settings = {};

export const ERROR_MESSAGES = {
    required: "Пожалуйста, заполните это поле",
    invalidEmail: "Введите корректный Email, например: name@example.com",
    invalidPhone: "Введите номер телефона в формате: +71234567890",
};

export const CATEGORY_COLORS: Record<string, string> = {
    "дополнительное": "additional",
    "софт-скил": "soft",
    "кнопка": "button",
    "хард-скил": "hard",
    "другое": "other"
};