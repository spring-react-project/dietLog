package jpabook.jpabasic.service;

import jpabook.jpabasic.api.dto.FoodSearchResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
public class FoodSearchService {

    private List<FoodSearchResponse> foodData = new ArrayList<>();

    @PostConstruct
    public void loadCsvData() {
        try {
            log.info("Loading CSV data from foods_kcal_category_merged.csv");
            ClassPathResource resource = new ClassPathResource("foods_kcal_category_merged.csv");
            
            try (BufferedReader reader = new BufferedReader(
                    new InputStreamReader(resource.getInputStream(), StandardCharsets.UTF_8))) {
                
                // 헤더 스킵
                String header = reader.readLine();
                if (header == null) {
                    log.warn("CSV file is empty");
                    return;
                }
                
                String line;
                int count = 0;
                while ((line = reader.readLine()) != null) {
                    try {
                        String[] parts = parseCsvLine(line);
                        if (parts.length >= 8) {
                            foodData.add(new FoodSearchResponse(
                                parts[0], // uid
                                parts[1], // food_code
                                parts[2], // name
                                parts[3], // category
                                parseDouble(parts[4]), // kcal
                                parseDouble(parts[5]), // base_amount
                                parts[6], // source
                                parts[7]  // group
                            ));
                            count++;
                        }
                    } catch (Exception e) {
                        log.warn("Error parsing line: " + line, e);
                    }
                }
                log.info("Loaded {} food items from CSV", count);
            }
        } catch (Exception e) {
            log.error("Error loading CSV file", e);
        }
    }

    private String[] parseCsvLine(String line) {
        List<String> result = new ArrayList<>();
        boolean inQuotes = false;
        StringBuilder current = new StringBuilder();
        
        for (char c : line.toCharArray()) {
            if (c == '"') {
                inQuotes = !inQuotes;
            } else if (c == ',' && !inQuotes) {
                result.add(current.toString().trim());
                current = new StringBuilder();
            } else {
                current.append(c);
            }
        }
        result.add(current.toString().trim());
        return result.toArray(new String[0]);
    }

    private Double parseDouble(String value) {
        try {
            return value == null || value.isEmpty() ? null : Double.parseDouble(value);
        } catch (NumberFormatException e) {
            return null;
        }
    }

    public List<FoodSearchResponse> searchByName(String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) {
            return new ArrayList<>();
        }
        
        String lowerKeyword = keyword.toLowerCase();
        return foodData.stream()
                .filter(food -> food.getName() != null && 
                              food.getName().toLowerCase().contains(lowerKeyword))
                .limit(100) // 최대 100개만 반환
                .collect(Collectors.toList());
    }

    public List<FoodSearchResponse> searchByKcalRange(Double minKcal, Double maxKcal) {
        return foodData.stream()
                .filter(food -> {
                    if (food.getKcal() == null) return false;
                    if (minKcal != null && food.getKcal() < minKcal) return false;
                    if (maxKcal != null && food.getKcal() > maxKcal) return false;
                    return true;
                })
                .limit(100)
                .collect(Collectors.toList());
    }

    public List<FoodSearchResponse> searchByCategory(String category) {
        if (category == null || category.trim().isEmpty()) {
            return new ArrayList<>();
        }
        
        String lowerCategory = category.toLowerCase();
        return foodData.stream()
                .filter(food -> food.getCategory() != null && 
                              food.getCategory().toLowerCase().contains(lowerCategory))
                .limit(100)
                .collect(Collectors.toList());
    }

    public List<FoodSearchResponse> search(String keyword, Double minKcal, Double maxKcal, String category) {
        return foodData.stream()
                .filter(food -> {
                    // 이름 검색
                    if (keyword != null && !keyword.trim().isEmpty()) {
                        if (food.getName() == null || 
                            !food.getName().toLowerCase().contains(keyword.toLowerCase())) {
                            return false;
                        }
                    }
                    
                    // 칼로리 범위 검색
                    if (food.getKcal() != null) {
                        if (minKcal != null && food.getKcal() < minKcal) return false;
                        if (maxKcal != null && food.getKcal() > maxKcal) return false;
                    }
                    
                    // 카테고리 검색
                    if (category != null && !category.trim().isEmpty()) {
                        if (food.getCategory() == null || 
                            !food.getCategory().toLowerCase().contains(category.toLowerCase())) {
                            return false;
                        }
                    }
                    
                    return true;
                })
                .limit(100)
                .collect(Collectors.toList());
    }
}
