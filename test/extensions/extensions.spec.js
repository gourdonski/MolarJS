describe('Extensions', function() {
    it('says something funny', function () {
        //Test pass-through function with args.
        var args = molar.helpers.through('Hello', ' ', 'World');

        expect(args.length).toBe(3);
    
        //Test pass-through function without args.
        args = molar.helpers.through();

        expect(args).not.toBeDefined();

        args = molar.helpers.through('!');

        //Test pass-through function returning single arg as arg and not array.
        expect(args).toBe('!');
        
        //Test array helpers.
        var arr = [ 'a', 'b', 'c' ];
        arr.test = true;

        //Test array contains elements.
        expect(molar.array.any(arr)).toBe(true);

        var predicate = function(el) { return el === 'b' };

        //test array contains elements that match predicate.
        expect(molar.array.any(arr, predicate)).toBe(true);

        //Test first element that matches predicate.
        expect(molar.array.first(arr, predicate)).toBe('b');

        //Test element at a negative index.
        expect(molar.array.elementAt(arr, -1)).toBe('c');
        
        expect(molar.array.elementAt(arr, -3)).toBe('a');

        //Test element at a positive index.
        expect(molar.array.elementAt(arr, 1)).toBe('b');

        //Test retrieving non-index value.
        expect(molar.array.elementAt(arr, 'test')).toBe(true);
    });
});

describe('DateBuilder', function() {
   it('builds a valid date', function() {
       var dateBuilder = new molar.DateBuilder(),
           now = dateBuilder.build();

       //Test default date.
       expect(now.getTime()).toBe(new Date(new Date().getFullYear(), 0, 1).getTime());

       dateBuilder = new molar.DateBuilder(1970, 0, 1, 0, 0);

       var date = dateBuilder.build();

       //Test constructed date.
       expect(date.getTime()).toBe(new Date(1970, 0, 1, 0, 0).getTime());
   });
});
