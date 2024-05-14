package com.helloshoes.shoeshopmanagement.util;

public enum IdType {
    ITEM_COLOUR("IC"),
    ITEM_DETAILS("ID"),
    ITEM_SIZE("IS"),
    ITEM("ITC");
    private final String code;

    IdType(String code) {
        this.code = code;
    }

    public String getCode() {
        return code;
    }
}
