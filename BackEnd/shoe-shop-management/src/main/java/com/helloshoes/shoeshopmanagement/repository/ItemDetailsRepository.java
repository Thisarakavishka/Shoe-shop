package com.helloshoes.shoeshopmanagement.repository;

import com.helloshoes.shoeshopmanagement.entity.ItemDetails;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ItemDetailsRepository extends JpaRepository<ItemDetails, String> {
    List<ItemDetails> findByItem_ItemCodeAndColour_ColourCode(String itemId, String colourCode);
}
