package com.helloshoes.shoeshopmanagement.repository;

import com.helloshoes.shoeshopmanagement.entity.Colour;
import com.helloshoes.shoeshopmanagement.entity.Item;
import com.helloshoes.shoeshopmanagement.entity.ItemColour;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ItemColourRepository extends JpaRepository<ItemColour, String> {
    ItemColour findByItemItemCodeAndColourColourCode(String itemCode, String colourCode);

    List<ItemColour> findByItem_ItemCode(String itemCode);

    Optional<ItemColour> findByItemAndColour(Item item, Colour colour);
}
