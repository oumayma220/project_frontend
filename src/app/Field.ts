export interface Field {
    name: string;
    type: 'string' | 'number' |'integer' | 'boolean' | 'array' | 'object';
    required: boolean;
    children?: Field[]; 
  }
  

  