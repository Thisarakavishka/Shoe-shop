package com.helloshoes.shoeshopmanagement.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "category")
public class Category implements SuperEntity {
    @Id
    private String categoryCode;
    private String categoryName;
    private String categoryCharacter;

    @ManyToMany(mappedBy = "categories")
    private List<Item> items;
}
