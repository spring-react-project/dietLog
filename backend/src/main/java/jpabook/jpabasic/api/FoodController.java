package jpabook.jpabasic.api;

import jpabook.jpabasic.api.dto.FoodCreateRequest;
import jpabook.jpabasic.domain.Food;
import jpabook.jpabasic.repository.FoodRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/foods")
public class FoodController {
    private final FoodRepository foodRepository;

    @GetMapping
    public List<Food> list(){
        return foodRepository.findAll();
    }
    @PostMapping
    public ResponseEntity<Food> create(@RequestBody FoodCreateRequest req){
        if(req.getName()==null || req.getName().isEmpty())
            throw new IllegalStateException("name is required");

        if(req.getCalories()==null)
            throw new IllegalStateException("calories is required");

        if(req.getCalories()==null||req.getIconKey().isEmpty())
            throw new IllegalStateException("iconKey is required");

        Food food = Food.builder()
                .name(req.getName())
                .calories(req.getCalories())
                .iconKey(req.getIconKey())
                .category(req.getCategory())
                .build();

        Food savedFood = foodRepository.save(food);
        return ResponseEntity.status(201).body(savedFood);
    }

}
