const rules = {
    code : [
            v => !!v || 'من فضلك ادخل الكود',
            v => !isNaN(parseInt(v)) || 'يجب ان يكون الكود عدد',
            // v => v.length <= 10 || 'Name must be less than 10 characters',
        ],
    qty : [
            v => !!v || 'من فضلك ادخل الكمية',
            v => !isNaN(parseInt(v)) || 'يجب ان تكون الكمية عدد',
        ],
    qtyWhole : [
        v => !!v || '  من فضلك ادخل الكمية الكلية',
        v => !isNaN(parseInt(v)) || 'يجب ان تكون الكمية الكلية عدد',
    ],
}
export default rules