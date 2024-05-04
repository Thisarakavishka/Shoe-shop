package com.helloshoes.shoeshopmanagement.util;

import java.util.HashMap;
import java.util.Map;

public class IDGeneratorUtil {
    private static Map<IdType, Integer> counter = new HashMap<>();

    public static String idGenerator(IdType type) {
        counter.putIfAbsent(type, 0);
        int count = counter.get(type) + 1;
        counter.put(type, count);
        return type.getCode() + String.format("%03d", count);
    }
}

