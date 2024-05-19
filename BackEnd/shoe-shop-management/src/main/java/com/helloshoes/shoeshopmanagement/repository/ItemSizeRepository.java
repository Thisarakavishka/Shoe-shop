package com.helloshoes.shoeshopmanagement.repository;

import com.helloshoes.shoeshopmanagement.entity.Colour;
import com.helloshoes.shoeshopmanagement.entity.Item;
import com.helloshoes.shoeshopmanagement.entity.ItemSize;
import com.helloshoes.shoeshopmanagement.entity.Size;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ItemSizeRepository extends JpaRepository<ItemSize, String> {
    List<ItemSize> findByItemAndColour(Item item, Colour colour);

    Optional<ItemSize> findByItemAndColourAndSize(Item item, Colour colour, Size size);

    void deleteAllByItemAndColour(Item item, Colour colour);
}
