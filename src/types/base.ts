// Базовый интерфейс компонента отображения
export interface IViewComponent {
    element: HTMLElement;
    toggle(visible: boolean): void;
    bind(selector: string): HTMLElement;
}