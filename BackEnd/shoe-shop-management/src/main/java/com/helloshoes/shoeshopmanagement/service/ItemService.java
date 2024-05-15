package com.helloshoes.shoeshopmanagement.service;

import com.helloshoes.shoeshopmanagement.dto.ItemDTO;

import java.util.List;

public interface ItemService extends SuperService<ItemDTO> {
    List<ItemDTO> getAll(int page, int size);
}
