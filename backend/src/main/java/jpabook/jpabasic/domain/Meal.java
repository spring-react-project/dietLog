package jpabook.jpabasic.domain;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Entity
@Table(name = "meals")
public class Meal extends BaseTimeEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @Column(nullable = false)
    private LocalDate date;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private MealType type;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false)
    private Integer calories;

    @Column(columnDefinition = "TEXT")
    private String memo;

    @Builder
    private Meal(LocalDate date, MealType type, String name, Integer calories, String memo) {
        this.date = date;
        this.type = type;
        this.name = name;
        this.calories = calories;
        this.memo = memo;
    }

    public void update(LocalDate date, MealType type, String name, Integer calories, String memo) {
        this.date = date;
        this.type = type;
        this.name = name;
        this.memo = memo;
        this.calories = this.calories;
        this.memo = memo;
    }


}
