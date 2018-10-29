#version 330

in vec4 fragmentColor; // c_base
in vec4 vertexWorldPosition;
in vec3 vertexWorldNormal;

out vec4 finalColor;

uniform InputMaterial {
    float matRoughness;
    vec4 matSpecular;
    float matMetallic;
} material;

struct LightProperties {
    vec4 diffuseColor;
    vec4 specularColor;
    vec4 directionalLightDir;
    float spotInnerConeAngleDegrees;
    float spotOuterConeAngleDegrees;
};
uniform LightProperties genericLight;

struct PointLight {
    vec4 pointPosition;
};
uniform PointLight pointLight;

uniform vec4 cameraPosition;

uniform float constantAttenuation;
uniform float linearAttenuation;
uniform float quadraticAttenuation;

uniform int lightingType;

const float PI = 3.1415926535;

vec4 pointLightSubroutine(vec4 N, vec4 worldPosition, vec3 worldNormal)
{
    // Direction from the surface to the point light
    vec4 L = normalize(pointLight.pointPosition - vertexWorldPosition);
    float NdL = max(0, dot(N,L));

    // Insert code for Section 3.2 here.
    // Lmbertian diffuse
    vec4 c_diff = (1 - material.matMetallic) * fragmentColor;
    vec4 c_spec = mix(material.matSpecular, fragmentColor, material.matMetallic);
    vec4 d = c_diff / PI;
    
    // Specular
    vec4 V = normalize(cameraPosition - vertexWorldPosition);
    vec4 H = normalize(L + V);
    float denom = 4. * max(0, dot(N, L)) * max(0, dot(N, V));

    vec4 s = vec4(0.);
    if (denom >0) {
        s = vec4(0.);
        float alpha_2 = pow(material.matRoughness, 4); 
        float D = alpha_2 / (PI * pow(pow(max(0, dot(N, H)), 2)* (alpha_2 - 1) + 1, 2));
        float k = pow((material.matRoughness + 1), 2) / 8.;
        
        float G_L = max(0, dot(N, L)) / (max(0, dot(N, L)) * (1 - k) + k);
        float G_V = max(0, dot(N, V)) / (max(0, dot(N, V)) * (1 - k) + k);

        float G = G_L / G_V;
        float power = (-5.55473 * max(0, dot(V, H)) - 6.98316) * max(0, dot(V, H));
        vec4 F = c_spec + (1 - c_spec) * pow(2, power);
        s = D * F * G / denom;
    }
    vec4 final_color = NdL * (d * genericLight.diffuseColor + s * genericLight.specularColor);
    return final_color;
}

vec4 directionalLightSubroutine(vec4 N, vec4 worldPosition, vec3 worldNormal)
{
    // Insert code for Section 3.3 here.
    vec4 L = -genericLight.directionalLightDir;
    float NdL = max(0, dot(N,L));

    // Lmbertian diffuse
    vec4 c_diff = (1 - material.matMetallic) * fragmentColor;
    vec4 c_spec = mix(material.matSpecular, fragmentColor, material.matMetallic);
    vec4 d = c_diff / PI;
    
    // Specular
    vec4 V = normalize(cameraPosition - vertexWorldPosition);
    vec4 H = normalize(L + V);
    float denom = 4. * max(0, dot(N, L)) * max(0, dot(N, V));

    vec4 s = vec4(0.);
    if (denom >0) {
        s = vec4(0.);
        float alpha_2 = pow(material.matRoughness, 4); 
        float D = alpha_2 / (PI * pow(pow(max(0, dot(N, H)), 2)* (alpha_2 - 1) + 1, 2));
        float k = pow((material.matRoughness + 1), 2) / 8.;
        
        float G_L = max(0, dot(N, L)) / (max(0, dot(N, L)) * (1 - k) + k);
        float G_V = max(0, dot(N, V)) / (max(0, dot(N, V)) * (1 - k) + k);

        float G = G_L / G_V;
        float power = (-5.55473 * max(0, dot(V, H)) - 6.98316) * max(0, dot(V, H));
        vec4 F = c_spec + (1 - c_spec) * pow(2, power);
        s = D * F * G / denom;
    }
    vec4 final_color = NdL * (d * genericLight.diffuseColor + s * genericLight.specularColor);
    return final_color;
}

vec4 hemisphereLightSubroutine(vec4 N, vec4 worldPosition, vec3 worldNormal)
{
    // Insert code for Section 3.4 here.
    vec4 L = N;
    float NdL = max(0, dot(N,L));
    
    vec4 t = vec4(0);
    t.y = 1.;
    vec4 c_light = mix(genericLight.diffuseColor, genericLight.specularColor, clamp(max(0, dot(N, t)) * 0.5 + 0.5, 0, 1));
    
    // Lmbertian diffuse
    vec4 c_diff = (1 - material.matMetallic) * fragmentColor;
    vec4 c_spec = mix(material.matSpecular, fragmentColor, material.matMetallic);
    vec4 d = c_diff / PI;
    
    // Specular
    vec4 V = normalize(cameraPosition - vertexWorldPosition);
    vec4 H = normalize(L + V);
    float denom = 4. * max(0, dot(N, L)) * max(0, dot(N, V));

    vec4 s = vec4(0.);
    if (denom >0) {
        s = vec4(0.);
        float alpha_2 = pow(material.matRoughness, 4); 
        float D = alpha_2 / (PI * pow(pow(max(0, dot(N, H)), 2)* (alpha_2 - 1) + 1, 2));
        float k = pow((material.matRoughness + 1), 2) / 8.;
        
        float G_L = max(0, dot(N, L)) / (max(0, dot(N, L)) * (1 - k) + k);
        float G_V = max(0, dot(N, V)) / (max(0, dot(N, V)) * (1 - k) + k);

        float G = G_L / G_V;
        float power = (-5.55473 * max(0, dot(V, H)) - 6.98316) * max(0, dot(V, H));
        vec4 F = c_spec + (1 - c_spec) * pow(2, power);
        s = D * F * G / denom;
    }
    vec4 final_color = NdL * d * c_light;
    return final_color;
}

vec4 spotLightSubroutine(vec4 N, vec4 worldPosition, vec3 worldNormal)
{
    // Insert code for Section 3.5 here.
    vec4 L = normalize(pointLight.pointPosition - vertexWorldPosition);
    float NdL = max(0, dot(N,L));

    //Calculating gamma
    float c_th = max(0, dot(-L, genericLight.directionalLightDir));
    float gamma = 0;
    float c_1 = cos(genericLight.spotInnerConeAngleDegrees / 180. * PI);
    float c_2 = cos(genericLight.spotOuterConeAngleDegrees / 180. * PI);
    if (c_th > c_1)
        gamma = 1.;
    else if (c_th < c_2)
        gamma = 0.;
    else
        gamma = (c_th - c_2) / (c_1 - c_2);

    // Lmbertian diffuse
    vec4 c_diff = (1 - material.matMetallic) * fragmentColor;
    vec4 c_spec = mix(material.matSpecular, fragmentColor, material.matMetallic);
    vec4 d = c_diff / PI;
    
    // Specular
    vec4 V = normalize(cameraPosition - vertexWorldPosition);
    vec4 H = normalize(L + V);
    float denom = 4. * max(0, dot(N, L)) * max(0, dot(N, V));

    vec4 s = vec4(0.);
    if (denom >0) {
        s = vec4(0.);
        float alpha_2 = pow(material.matRoughness, 4); 
        float D = alpha_2 / (PI * pow(pow(max(0, dot(N, H)), 2)* (alpha_2 - 1) + 1, 2));
        float k = pow((material.matRoughness + 1), 2) / 8.;
        
        float G_L = max(0, dot(N, L)) / (max(0, dot(N, L)) * (1 - k) + k);
        float G_V = max(0, dot(N, V)) / (max(0, dot(N, V)) * (1 - k) + k);

        float G = G_L / G_V;
        float power = (-5.55473 * max(0, dot(V, H)) - 6.98316) * max(0, dot(V, H));
        vec4 F = c_spec + (1 - c_spec) * pow(2, power);
        s = D * F * G / denom;
    }
    vec4 final_color = NdL * (d * (gamma * genericLight.diffuseColor) + s * (gamma * genericLight.specularColor));
    return final_color;

}

vec4 globalLightSubroutine(vec4 worldPosition, vec3 worldNormal)
{
    return vec4(0.0);
}

vec4 attenuateLight(vec4 originalColor)
{
    float lightDistance = length(pointLight.pointPosition - vertexWorldPosition);
    float attenuation = 1.0 / (constantAttenuation + lightDistance * linearAttenuation + lightDistance * lightDistance * quadraticAttenuation);
    return originalColor * attenuation;
}

void main()
{
    // Normal to the surface
    vec4 N = vec4(normalize(vertexWorldNormal), 0.f);

    vec4 lightingColor = vec4(0);
    if (lightingType == 0) {
        lightingColor = globalLightSubroutine(vertexWorldPosition, vertexWorldNormal);
    } else if (lightingType == 1) {
        lightingColor = attenuateLight(pointLightSubroutine(N, vertexWorldPosition, vertexWorldNormal));
    } else if (lightingType == 2) {
        lightingColor = directionalLightSubroutine(N, vertexWorldPosition, vertexWorldNormal);
    } else if (lightingType == 3) {
        lightingColor = hemisphereLightSubroutine(N, vertexWorldPosition, vertexWorldNormal);
    } else if (lightingType == 5) {
        lightingColor = attenuateLight(spotLightSubroutine(N, vertexWorldPosition, vertexWorldNormal));
    }
    finalColor = lightingColor * fragmentColor;
    finalColor.a = 1.0;
}

