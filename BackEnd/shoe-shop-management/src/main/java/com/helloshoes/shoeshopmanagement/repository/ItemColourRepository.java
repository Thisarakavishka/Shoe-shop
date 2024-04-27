package com.helloshoes.shoeshopmanagement.repository;

import com.helloshoes.shoeshopmanagement.entity.ItemColour;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ItemColourRepository extends JpaRepository<ItemColour, String> {
}
