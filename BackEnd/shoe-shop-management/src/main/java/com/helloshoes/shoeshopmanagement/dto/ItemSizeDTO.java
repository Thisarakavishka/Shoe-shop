package com.helloshoes.shoeshopmanagement.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ItemSizeDTO implements SuperDTO{
    private Integer size;
    private Integer quantity;
}
