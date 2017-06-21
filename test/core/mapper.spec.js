describe('Mapper', function() {
    it('came from the Macroverse', function() {
        var mapper = new molar.Mapper(),
            obj1 = { name: '1', value: '1', status: 'started' };

        //Test no auto-mapping.
        mapper.register(new molar.MapperDef('Test1', false)
            .define('No auto mapper test')
            .addMap('value', 'value')
            .addMap('value', 'id', function(src) { return Number(src) + 1; })
            .addMap('status', 'status', null, function(src) { return src.status === 'completed'; }));

        var obj2 = mapper.map(obj1, 'Test1');

        expect(obj2.value).toBeDefined();
        expect(obj2.id).toBe(2);
        expect(obj2.status).not.toBeDefined();

        //Test auto-mapping.
        mapper.register(new molar.MapperDef('Test2', true)
            .define('Auto mapper test')
            .addMap('value', 'id', function(src) { return +src + 1; }));

        var obj3 = mapper.map(obj1, 'Test2');

        expect(obj3.name).toBe('1');
        expect(obj3.value).toBeDefined();
        expect(obj3.id).toBe(2);
    });
});
