package com.helloshoes.shoeshopmanagement.util;

public class RegexUtil {
    public static final String PHONE_NUMBER_REGEX = "\\d{10}";
    public static final String POSTAL_CODE_REGEX = "\\d{5}";
    public static final String EMPLOYEE_REGEX = "^EMP\\d{3}$";
    public static final String CUSTOMER_REGEX = "^CUS\\d{3}$";
    public static final String SUPPLIER_REGEX = "^SUP\\d{3}$";
    public static final String CATEGORY_REGEX = "^CAT\\d{3}$";
    public static final String TYPE_REGEX = "^TYP\\d{3}$";
    public static final String SIZE_REGEX = "^SIZ\\d{3}$";
    public static final String COLOUR_REGEX = "^COL\\d{3}$";
    public static final String ITEM_REGEX = "^IC\\d{3}$";
    public static final String SALE_REGEX = "^SC\\d{3}$";
    public static final String REFUND_REGEX = "^RF\\d{3}$";
}
