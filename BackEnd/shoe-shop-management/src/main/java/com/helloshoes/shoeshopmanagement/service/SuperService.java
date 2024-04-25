package com.helloshoes.shoeshopmanagement.service;

import com.helloshoes.shoeshopmanagement.dto.EmployeeDTO;

import java.util.List;

public interface SuperService<T> {
    T save(T dto);

    Boolean delete(String code);

    T getByCode(String code);

    List<T> getAll();

    Boolean update(String code, T dto);
}
