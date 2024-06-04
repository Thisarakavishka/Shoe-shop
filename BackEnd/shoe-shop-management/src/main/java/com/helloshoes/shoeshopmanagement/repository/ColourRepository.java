package com.helloshoes.shoeshopmanagement.repository;

import com.helloshoes.shoeshopmanagement.entity.Colour;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ColourRepository extends JpaRepository<Colour, String> {
    @Query(value = "SELECT c FROM Colour c WHERE c.colourName = :colourName")
    Colour findByName(@Param("colourName") String colourName);

    @Query(value = "SELECT MAX(c.colourCode) FROM Colour  c")
    String findNextColourCode();
}
