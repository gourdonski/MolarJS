declare var molar: molar.IMolar;

declare module 'molar' {
    export = molar;
}

declare namespace molar {
    interface IMolar {
        helpers: IHelper;
        array: IArrayHelper;
        Lookup: ILookupStatic;
        ready: molar.ready.IReady;
        DateBuilder: IDateBuilderStatic;
        Ready: IReadyStatic;
    }

    interface IHelper {
        isArray(val: any): boolean;
        isUndefined(val: any): boolean;
        isFunction(val: any): boolean;
        isString(val: any): boolean;
        isInteger(val: any): boolean;
        isDate(val: any): boolean;
        through(...args: any[]): any;
        mixin(source: any, target: any): any;
        stringify(obj: any): string;
        hash(string: string): number;
        iterator<T>(values: T[]): IIterator<T>;
    }

    interface IArrayHelper {
        first(arr: any[], predicate: (item: any) => boolean): any;
        any(arr: any[], predicate: (item: any) => boolean): any;
        elementAt(arr: any[], index: number, value: any): any;
    }

    interface IIterator<T> {
        current(): T;
        next(): T;
        peek(): T;
        seek(predicate: (value: T) => boolean): T;
        reset(): void;
    }

    interface IDateBuilderStatic {
        new(year?: number, month?: number, date?: number, hours?: number, minutes?: number): IDateBuilder;
    }

    interface IDateBuilder {
        minutes(minutes: number): void;
        hours(hours: number): void;
        date(date: number): void;
        month(month: number): void;
        year(year: number): void;
        set(index: number, value: number): void;
        getMinutes(): number;
        getHours(): number;
        getDate(): number;
        getMonth(): number;
        getYear(): number;
        build(): Date
    }

    interface ILookupStatic {
        new(allowDuplicate: boolean, ttlInMilliseconds: number): ILookup;
    }

    interface ILookup {
        add(key: any, value: any): boolean;
        load(data: any[], key: any, transform?: Function): ILookup;
        clear(): void;
        removeBy(predicate: Function): number;
        removeFirst(predicate: Function): boolean;
        remove: {
            (...keys: any[]): number;
            (keys: any | any[]): number;
        }
        findBy(predicate: Function): any[];
        findFirst(predicate: Function): any;
        find: {
            (...keys: any[]): any[];
            (keys: any | any[]): any[];
        }
        contains(key: any): boolean;
        values(): any[];
        count(): number;
    }

    interface IReadyStatic {
        new(expression: string): IReady;
    }

    interface IReady {
        expression: molar.ready.IExpression;
        intersects(time: Date): Date;
    }
}

declare namespace molar.ready {
    interface IReady {
        Expression: IExpressionStatic;
        RangeField: IRangeFieldStatic;
        ListField: IListFieldStatic;
        SingleField: ISingleFieldStatic;
        WildCardField: IWildCardFieldStatic;
    }

    interface IExpressionStatic {
        new(expression: string): IExpression;
    }
    
    interface IExpression {
        getIterator(): molar.IIterator<{ start: molar.IDateBuilder, end: molar.IDateBuilder }>;
    }

    interface IField {
        getIterator(): IFieldIterator<number>;
        name?: string;
        type: string;
        isBlockField?: boolean;
    }

    interface IRangeFieldStatic {
        new(name: string, minValue: number, maxValue: number): IRangeField;
    }
    
    interface IRangeField extends IField {
        minValue: number;
        maxValue: number;
    }

    interface IListFieldStatic {
        new(name: string, values: any[]): IListField;
    }
    
    interface IListField extends IField {
        getListIterator(): IFieldIterator<IField>;
        rawValues: number[];
        values: IField[];
    }

    interface ISingleFieldStatic {
        new(name: string, value: any): ISingleField;
    }
    
    interface ISingleField extends IField {
        value: number;
    }

    interface IWildCardFieldStatic extends IWildCardField {
        new (): IWildCardField;
        parse(field: any): IWildCardField;
    }
    
    interface IWildCardField extends IField {
    }
    
    interface IFieldIterator<T> extends IIterator<T> {
        field?: string;
        isBlockIterator?: boolean;
    }
}
