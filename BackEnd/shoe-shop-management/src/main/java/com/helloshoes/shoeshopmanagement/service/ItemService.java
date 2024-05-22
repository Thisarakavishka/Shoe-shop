package com.helloshoes.shoeshopmanagement.service;

import com.helloshoes.shoeshopmanagement.dto.ItemDTO;
import org.springframework.data.domain.Page;

import java.util.List;

public interface ItemService extends SuperService<ItemDTO> {
    List<ItemDTO> getAll(int page, int size);

    int getItemCount();

    String getNextItemCode();

    List<ItemDTO> getSearchItems(String query);

    Page<ItemDTO> searchItems(String query, String type, String category, String supplier, int page, int size);
}
