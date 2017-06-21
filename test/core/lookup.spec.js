describe('Lookup', function() {
    it('puts the lotion on its skin, or else it gets the hose again', function() {
        var lookup1 = new molar.Lookup(false);
        lookup1.add('1', { name: '1' });
        lookup1.add('2', { name: '2' });
        lookup1.add('3', { name: '3' });
        lookup1.add('3', { name: '4' });

        //Test no duplicates.
        expect(lookup1.count()).toBe(3);
        expect(lookup1.contains('1')).toBe(true);

        var results = lookup1.find('2');

        expect(results.length).toBe(1);

        lookup1.remove('3');

        expect(lookup1.contains('3')).toBe(false);

        var values = lookup1.values();

        expect(values.length).toBe(2);

        //Test find by predicate.
        results = lookup1.findBy(function(obj) {
            return /\d+/.test(obj.key);
        });

        expect(results.length).toBe(2);

        //Test remove by predicate.
        var count = lookup1.removeBy(function(obj) {
            return +obj.key < 2;
        });

        expect(count).toBe(1);
        expect(lookup1.count()).toBe(1);

        //Test remove first predicate.
        var result = lookup1.removeFirst(function(obj) {
           return +obj.value.name === 2;
        });

        expect(result).toBe(true);
        expect(lookup1.count()).toBe(0);

        //Test expiration behavior by setting TTL to -1.
        var lookup2 = new molar.Lookup(true, -1);
        lookup2.add('1', { name: '1' });
        lookup2.add('2', { name: '2' });
        lookup2.add('3', { name: '3' });

        expect(lookup2.count()).toBe(0);

        var lookup3 = new molar.Lookup(true, -1);
        lookup3.add('1', { name: '1' });
        lookup3.add('2', { name: '2' });
        lookup3.add('3', { name: '3' });

        expect(lookup3.values().length).toBe(0);

        var obj1 = { id: 1, value: 'test1'},
            obj2 = { id: 2, value: 'test2'},
            obj3 = { id: 3, value: 'test3'},
            lookup4 = new molar.Lookup();
        
        //Test load getting key from function and transforming value.
        lookup4.load([obj1, obj2, obj3],
            function(obj) { return String(obj.id); },
            function(obj) { obj.value += 'A'; return obj; });

        expect(lookup4.count()).toBe(3);

        var obj4 = { id: 4, value: 'test4'},
            obj5 = { id: 5, value: 'test5'},
            obj6 = { id: 6, value: 'test6'},
            lookup5 = new molar.Lookup();

        //Test load getting key from string.
        lookup5.load([obj4, obj5, obj6], 'id');

        expect(lookup5.count()).toBe(3);

        expect(lookup5.values()[1].value).toBe('test5');

        //Test a larger collection.
        var lookup6 = new molar.Lookup(true, 5000);

        for (var i = 0; i < 5000; i++) {
            lookup6.add(i, { id: i, value: i.toString() });
            lookup6.add(i, { id: i, value: i.toString() + 'a' });
        }

        results = lookup6.findBy(function(item) {
            return item.value.value.indexOf('a') >= 0;
        });

        expect(results.length).toBe(5000);

        lookup6.clear();

        expect(lookup6.count()).toBe(0);
    });
});
