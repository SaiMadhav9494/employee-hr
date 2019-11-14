export interface Employee {
    id?: string,
    fullName: string,
    role: string,
    grossPay: number,
    deductions: Array<string>,
    takeHomePay: number
}