package com.helloshoes.shoeshopmanagement.service;

import com.helloshoes.shoeshopmanagement.dto.TypeDTO;

public interface TypeService extends SuperService<TypeDTO> {
    TypeDTO getTypeByName(String typeName);

    String getNextTypeCode();
}
