package com.helloshoes.shoeshopmanagement.repository;

import com.helloshoes.shoeshopmanagement.entity.Colour;
import com.helloshoes.shoeshopmanagement.entity.Item;
import com.helloshoes.shoeshopmanagement.entity.ItemSize;
import com.helloshoes.shoeshopmanagement.entity.Size;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ItemSizeRepository extends JpaRepository<ItemSize, String> {
    List<ItemSize> findByItemAndColour(Item item, Colour colour);

    Optional<ItemSize> findByItemAndColourAndSize(Item item, Colour colour, Size size);

    void deleteAllByItemAndColour(Item item, Colour colour);

    @Query("SELECT isz FROM ItemSize isz " +
            "JOIN isz.item i " +
            "JOIN isz.colour c " +
            "JOIN isz.size s " +
            "WHERE i.itemCode = :itemCode " +
            "AND c.colourCode = :colourCode " +
            "AND s.sizeCode = :sizeCode")
    Optional<ItemSize> findByItemCodeAndColourCodeAndSizeCode(
            @Param("itemCode") String itemCode,
            @Param("colourCode") String colourCode,
            @Param("sizeCode") String sizeCode);
}
