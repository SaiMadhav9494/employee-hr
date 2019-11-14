import { Employee } from './employee.model';

export interface ServerResponse {
    error: string;
    data?: Array<Employee>
}