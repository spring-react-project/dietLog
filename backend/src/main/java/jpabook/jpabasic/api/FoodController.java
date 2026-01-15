package jpabook.jpabasic.api;

import jpabook.jpabasic.api.dto.FoodCreateRequest;
import jpabook.jpabasic.domain.Food;
import jpabook.jpabasic.repository.FoodRepository;
import jpabook.jpabasic.service.FoodService;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/foods")
public class FoodController {
    private final FoodRepository foodRepository;
    private final FoodService foodService;

    @GetMapping
    public List<Food> list(){
        return foodRepository.findAll();
    }
    
    @PostMapping
    public ResponseEntity<?> create(@RequestBody FoodCreateRequest req){
        if(req.getName()==null || req.getName().isEmpty())
            return ResponseEntity.badRequest().body("name is required");

        if(req.getCalories()==null)
            return ResponseEntity.badRequest().body("calories is required");

        if(req.getIconKey()==null || req.getIconKey().isEmpty())
            return ResponseEntity.badRequest().body("iconKey is required");

        try {
            // 중복 체크: 이미 존재하면 기존 음식 반환 (200 OK)
            Food existingFood = foodService.findByName(req.getName()).orElse(null);
            if (existingFood != null) {
                return ResponseEntity.ok(existingFood);
            }

            // 새로 생성
            Food food = Food.builder()
                    .name(req.getName())
                    .calories(req.getCalories())
                    .iconKey(req.getIconKey())
                    .category(req.getCategory())
                    .build();

            Food savedFood = foodRepository.save(food);
            return ResponseEntity.status(201).body(savedFood);
        } catch (DataIntegrityViolationException e) {
            // 중복 키 제약조건 위반 시 (예외적으로 발생한 경우)
            // 다시 한번 조회해서 기존 음식 반환
            Food existingFood = foodService.findByName(req.getName()).orElse(null);
            if (existingFood != null) {
                return ResponseEntity.ok(existingFood);
            }
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("이미 등록된 음식입니다: " + req.getName());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("음식 등록 중 오류가 발생했습니다: " + e.getMessage());
        }
    }

}
