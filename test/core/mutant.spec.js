describe('Mutant', function() {
    it('is happening again', function () {
        var obj = { id: 1, name: 'Test'}, mutant = new molar.Mutant(obj), Mutant = molar.Mutant;

        expect(mutant.mutated()).toBe(false);

        //Test mutate.
        mutant.id = 2;

        expect(mutant.mutated()).toBe(true);

        //Test rebase.
        mutant.rebase();

        expect(mutant.mutated()).toBe(false);

        mutant.name = 'Mutant';

        expect(mutant.mutated()).toBe(true);

        mutant.name = 'Test';

        expect(mutant.mutated()).toBe(false);

        //Test static compare.
        var arr1 = [ { id: 1 }, { id: 2 } ],
            arr2 = [ { id: 1 }, { id: 3 } ],
            arr3 = [ { id: 1 }, { id: 3 } ];

        expect(Mutant.compare(arr1, arr1)).toBe(true);

        expect(Mutant.compare(arr1, arr2)).toBe(false);

        expect(Mutant.compare(arr2, arr3)).toBe(true);
    });
});