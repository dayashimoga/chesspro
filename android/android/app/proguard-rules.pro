# Flutter-specific ProGuard rules
-keep class io.flutter.app.** { *; }
-keep class io.flutter.plugin.** { *; }
-keep class io.flutter.util.** { *; }
-keep class io.flutter.view.** { *; }
-keep class io.flutter.** { *; }
-keep class io.flutter.plugins.** { *; }

# Keep annotations
-keepattributes *Annotation*

# Hive
-keep class * extends com.google.protobuf.GeneratedMessageLite { *; }

# Google Fonts
-keep class com.google.android.gms.** { *; }
-dontwarn com.google.android.gms.**

# Firebase (if used)
-keep class com.google.firebase.** { *; }
-dontwarn com.google.firebase.**

# Google Play Core (deferred components)
-dontwarn com.google.android.play.core.**

# General
-dontwarn kotlin.**
-dontwarn kotlinx.**
-dontwarn javax.annotation.**
