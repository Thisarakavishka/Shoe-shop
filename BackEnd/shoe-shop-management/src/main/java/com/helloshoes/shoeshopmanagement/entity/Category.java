package com.helloshoes.shoeshopmanagement.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
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

    @ManyToMany(mappedBy = "categories", cascade = CascadeType.ALL)
    @JsonBackReference
    private List<Item> items;
}
