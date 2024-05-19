package com.helloshoes.shoeshopmanagement.repository;

import com.helloshoes.shoeshopmanagement.entity.Colour;
import com.helloshoes.shoeshopmanagement.entity.Item;
import com.helloshoes.shoeshopmanagement.entity.ItemDetails;
import com.helloshoes.shoeshopmanagement.entity.Size;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ItemDetailsRepository extends JpaRepository<ItemDetails, String> {
    List<ItemDetails> findByItem_ItemCodeAndColour_ColourCode(String itemCode, String colourCode);

    Optional<ItemDetails> findByItemAndColourAndSize(Item item, Colour colour, Size size);

    List<ItemDetails> findByItemAndColour(Item item, Colour colour);

    void deleteAllByItemAndColour(Item item, Colour colour);
}
